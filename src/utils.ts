import {env} from "../tests/test-config"

const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomBlockNumber = () => {
  return randomBetween(1, env.endBlock);
};

const randomOrder = (): "asc" | "desc" => {
  return Math.random() > 0.5 ? "asc" : "desc";
};

export { randomBetween, randomBlockNumber, randomOrder };
