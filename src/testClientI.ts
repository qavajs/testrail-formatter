import {testRailConfig} from "./testRailConfig";
// @ts-ignore
import { sendHttpRequest } from '@qavajs/steps-api';
interface IParams {
    baseURL: string,
    runId: number,
    userName: string,
    pass: string,
}
export class TRClinet {
    private pass: string;
    private userName: string;
    private baseURL: string;
    private runId: number|string;
    private headers: { Authorization: string; "Content-Type": string };

    constructor(params: IParams) {
        this.baseURL = params.baseURL;
        this.runId = params.runId;
        this.userName = params.userName;
        this.pass = params.pass;
        const token: string = `Basic ${Buffer.from(`${(this.userName)}:${this.pass}`).toString('base64')}`;
        const headers = {
            'Content-Type': 'application/json;  charset=utf-8',
            Authorization: token,
        };
        this.headers = headers;
    }

    async updateCaseStatusInRun(runId: number|string, caseId: number|string, requestBody: any) {
        const conf: any = {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: this.headers
        };
        return sendHttpRequest(`${(this.baseURL)}${testRailConfig.endpoint.addResultToRunById(this.runId)}`,
            conf)
    }

    async updateCaseFailStatusInRun(caseId: number|string, failMessage?: string) {
        return this.updateCaseStatusInRun(this.runId, caseId, testRailConfig.requestBody.updateTestStatus.fail(caseId, failMessage));
    }

    async updateCasePassStatusInRun(caseId: number|string) {
        return this.updateCaseStatusInRun(this.runId, caseId, testRailConfig.requestBody.updateTestStatus.pass(caseId));
    }
}
