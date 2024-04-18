import { ThorClient } from "../src/thor-client";

const node1 = process.env.BLUE_NODE;
const node2 = process.env.GREEN_NODE;

if (!node1 || !node2) {
  throw new Error("BLUE_NODE and GREEN_NODE must be set");
}

const blueNodeClient = new ThorClient(node1);
const greenNodeClient = new ThorClient(node2);

const env = {
  endBlock: 18_000_000,
};

export { blueNodeClient, greenNodeClient, env };
