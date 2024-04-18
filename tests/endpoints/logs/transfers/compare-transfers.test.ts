import {ThorClient} from "../../../../src/thor-client";
import {bestCommonBlock, randomBetween, randomOrder, performEqualityTest} from "../../../../src/utils";
import {env, blueNodeClient, greenNodeClient} from "../../../test-config";

describe("POST /logs/transfer", () => {
    const performRequest = async (
        client: ThorClient,
        offset: number,
        from: number,
        order: "asc" | "desc",
        to?: number
    ): Promise<any> => {
        const res = await client.queryTransferLogs({
            options: {
                limit: 100,
                offset,
            },
            // Query all events on chain
            criteriaSet: [],
            range: {
                unit: "block",
                from,
                to: to || env.endBlock,
            },
            order,
        });

        expect(res.httpCode).toBe(200);
        expect(res.success).toBe(true);

        return res.body;
    };

    test("Transfer Events - Should match", async () => {

        const commonBlock = await bestCommonBlock();

        for (let i = 0; i < 3_000; i++) {

            const from = randomBetween(0, commonBlock - 12);
            const offset = randomBetween(0, 100);
            const order = randomOrder();

            console.log(`TRANSFERS (offset=${offset} from=${from} order=${order} to=${commonBlock})`);

            const blueNodeEvents = await performRequest(blueNodeClient, offset, from, order, commonBlock);
            const greenNodeEvents = await performRequest(greenNodeClient, offset, from, order, commonBlock);

            await performEqualityTest(blueNodeEvents, greenNodeEvents);
        }
    }, 300_000);
});
