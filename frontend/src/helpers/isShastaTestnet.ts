export const isShastaTestnet = (nodeURL: string): boolean => {
  return nodeURL.split(".")[1] === "shasta";
};
