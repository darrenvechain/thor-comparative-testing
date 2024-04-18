import {env, blueNodeClient, greenNodeClient} from "../tests/test-config"
import {ThorClient} from "./thor-client";

const randomBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomBlockNumber = () => {
    return randomBetween(1, env.endBlock);
};

const randomOrder = (): "asc" | "desc" => {
    return Math.random() > 0.5 ? "asc" : "desc";
};

async function getBestBlock(node: ThorClient) {
    const bestBlock = await node.getBlock("best");
    const bestBlockNumber = bestBlock.body?.number;

    if (bestBlockNumber === undefined) {
        throw new Error("Can't get best block for node");
    }
    return bestBlockNumber;
}

const bestCommonBlock = async (): Promise<number> => {
    const blueNodeLastBlock = await getBestBlock(blueNodeClient);
    console.log("Blue node best block: ", blueNodeLastBlock);

    const greenNodeLastBlock = await getBestBlock(greenNodeClient);
    console.log("Green node best block: ", greenNodeLastBlock);

    return Math.min(blueNodeLastBlock, greenNodeLastBlock);
}

const performEqualityTest = async (
    node1Events: Array<any>,
    node2Events: Array<any>,
) => {

    expect(node1Events).toBeDefined();
    expect(node2Events).toBeDefined();

    expect(node1Events.length).toEqual(node2Events.length);
    expect(node1Events).toEqual(node2Events);
};

export {randomBetween, randomBlockNumber, randomOrder, bestCommonBlock, performEqualityTest};
