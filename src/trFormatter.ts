import { TRClient, IParams } from './testRailClient';
import { Formatter, Status } from '@cucumber/cucumber';

export default class TRFormatter extends Formatter {
    launchId = null;
    trConfig: IParams | null = null;
    trClient: TRClient | null = null;
    constructor(options: { eventBroadcaster: { on: (arg0: string, arg1: (envelope: any) => Promise<void>) => void; }; parsedArgvOptions: { trConfig: any; }; }) {
        super(options as any);
        options.eventBroadcaster.on('envelope', this.processEnvelope.bind(this));
        this.trConfig = options.parsedArgvOptions.trConfig;
        this.trClient = new TRClient(this.trConfig as IParams);
    }

    async processEnvelope(envelope: { testRunStarted: any; testRunFinished: any; testCaseFinished: any; }) {
        if (envelope.testCaseFinished) {
            await this.finishTest(envelope);
        }
    }

    async finishTest(envelope: { testRunStarted?: any; testRunFinished?: any; testCaseFinished: any; }) {
        if (envelope.testCaseFinished.willBeRetried) return;
        const testCase = this.eventDataCollector.getTestCaseAttempt(envelope.testCaseFinished.testCaseStartedId);
        const scenarioName: string|any = testCase.pickle.name;
        const scenarioId: string = scenarioName.split(' ')[0].match(/\d+/g).join();
        const status = Object.values(testCase.stepResults).some((step: any) => step.status !== Status.PASSED)
            ? Status.FAILED.toLowerCase()
            : Status.PASSED.toLowerCase();
        if (status === 'passed') {
            await (this.trClient as TRClient).updateCasePassStatusInRun(scenarioId)
        } else {
            await (this.trClient as TRClient).updateCaseFailStatusInRun(scenarioId)
        }
    }
}
