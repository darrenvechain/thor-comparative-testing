import { ThorClient } from "../../../../src/thor-client";
import { randomBetween, randomOrder } from "../../../../src/utils";
import { env, node1Client, node2Client } from "../../../test-config";

describe("POST /logs/event", () => {
  const performRequest = async (
    client: ThorClient,
    offset: number,
    from: number,
    order: "asc" | "desc",
  ): Promise<any> => {
    const res = await client.queryEventLogs({
      options: {
        limit: 100,
        offset,
      },
      // Query all events on chain
      criteriaSet: [],
      range: {
        unit: "block",
        from,
      },
      order,
    });

    expect(res.httpCode).toBe(200);
    expect(res.success).toBe(true);

    return res.body;
  };

  const performEqualityTest = async (
    offset: number,
    from: number,
    order: "asc" | "desc",
  ) => {
    console.log(`EVENTS (offset=${offset} from=${from})`);

    const node1Events = await performRequest(node1Client, offset, from, order);
    const node2Events = await performRequest(node2Client, offset, from, order);

    expect(node1Events).toBeDefined();
    expect(node2Events).toBeDefined();
    expect(node1Events).toEqual(node2Events);

    return node1Events?.length ?? 0;
  };

  test("VTHO Events - Should match", async () => {
    for (let i = 0; i < 1_000; i++) {
      const from = randomBetween(0, env.endBlock);
      const offset = randomBetween(0, 100);
      const order = randomOrder();

      await performEqualityTest(offset, from, order);
    }
  }, 300_000);
});
