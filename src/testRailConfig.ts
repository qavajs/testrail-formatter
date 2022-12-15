export const testRailConfig = {
    endpoint: {
        addResultToRunById: (runId: number|string): string => `index.php?/api/v2/add_results_for_cases/${runId}`,
    },
    requestBody: {
        updateTestStatus: {
            pass: (caseId: number|string) => ({
                results: [
                    {
                        case_id: caseId,
                        status_id: 1,
                        comment: 'This test pass',
                    }],
            }),
            fail: (caseId: number|string, failMessage: string = 'This test failed') => ({
                results: [
                    {
                        case_id: caseId,
                        status_id: 5,
                        comment: failMessage,
                    }],
            }),
        },
    }
}
