import {ThorClient} from "../../../../src/thor-client"
import {randomBetween, randomBlockNumber} from "../../../../src/utils"

describe('POST /logs/event', () => {

  const VTHO = '0x0000000000000000000000000000456E65726779'
  const node1Client = new ThorClient('https://sync-mainnet.vechain.org')
  const node2Client = new ThorClient('https://mainnet.vechain.org')

  const performRequest = async (client: ThorClient, offset: number, from: number): Promise<any> => {
    const res = await client.queryEventLogs({
      options: {
        limit: 100,
        offset,
      },
      criteriaSet: [
        {
          address: VTHO,
        }
      ],
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

    console.log(`Performing test with offset: ${offset} and from: ${from}`)

    const node1Events = await performRequest(node1Client, offset, from)
    const node2Events = await performRequest(node2Client, offset, from)

    expect(node1Events).toBeDefined()
    expect(node2Events).toBeDefined()
    expect(node1Events).toEqual(node2Events)

    return node1Events?.length ?? 0
  }

  test('VTHO Events - Should match', async () => {

    for (let i = 0; i < 20; i++) {
      const from = randomBetween(0, 16_000_000)

      for (let offset = 0; offset < 10; offset++) {
        await performEqualityTest(offset, from)
      }
    }
  }, 120_000)
});

