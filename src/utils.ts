const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const randomBlockNumber = () => {
  return randomBetween(1, 18_000_000);
}

export { randomBetween, randomBlockNumber };
