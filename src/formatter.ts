import {TRClinet} from "./testRailClient";
const { Formatter, Status } = require('@cucumber/cucumber');
export class TRFormatter extends Formatter {
    launchId = null;

    constructor(options: { eventBroadcaster: { on: (arg0: string, arg1: (envelope: any) => Promise<void>) => void; }; parsedArgvOptions: { trConfig: any; }; }) {
        super(options);
        options.eventBroadcaster.on('envelope', this.processEnvelope.bind(this));
        this.trConfig = options.parsedArgvOptions.trConfig;
        this.trClient = new TRClinet(this.trConfig);
    }

    async processEnvelope(envelope: { testRunStarted: any; testRunFinished: any; testCaseFinished: any; }) {
        if (envelope.testRunStarted) {
            await this.startLaunch();
        }
        else if (envelope.testRunFinished) {
            await this.finishLaunch();
        }
        else if (envelope.testCaseFinished) {
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
            await this.trClient.updateCasePassStatusInRun(scenarioId)
        } else {
            await this.trClient.updateCaseFailStatusInRun(scenarioId)
        }
    }
}
