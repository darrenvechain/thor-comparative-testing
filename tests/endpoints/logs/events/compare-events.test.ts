import {ThorClient} from "../../../../src/thor-client"
import {randomBetween} from "../../../../src/utils"
import {env, node1Client, node2Client} from "../../../test-clients"

describe('POST /logs/event', () => {

  const performRequest = async (client: ThorClient, offset: number, from: number): Promise<any> => {
    const res = await client.queryEventLogs({
      options: {
        limit: 100,
        offset,
      },
      // Query all events on chain
      criteriaSet: [],
      range: {
        unit: 'block',
        from,
      }
    })

    expect(res.httpCode).toBe(200)
    expect(res.success).toBe(true)

    return res.body
  }

  const performEqualityTest = async (offset: number, from: number) => {

    console.log(`EVENTS: ${offset} and from: ${from}`)

    const node1Events = await performRequest(node1Client, offset, from)
    const node2Events = await performRequest(node2Client, offset, from)

    expect(node1Events).toBeDefined()
    expect(node2Events).toBeDefined()
    expect(node1Events).toEqual(node2Events)

    return node1Events?.length ?? 0
  }

  test('VTHO Events - Should match', async () => {

    for (let i = 0; i < 100; i++) {
      // -1 million blocks to ensure we have events for each query
      const from = randomBetween(0, env.endBlock)
      const offset = randomBetween(0, 100)

      await performEqualityTest(offset, from)
    }
  }, 120_000)
});

