import {ThorClient} from "../src/thor-client"

const node1 = process.env.NODE_1_URL
const node2 = process.env.NODE_2_URL

if (!node1 || !node2) {
  throw new Error('NODE_1_URL and NODE_2_URL must be set')
}

const node1Client = new ThorClient(node1)
const node2Client = new ThorClient(node2)

export {
  node1Client,
  node2Client
}
