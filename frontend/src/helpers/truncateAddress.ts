export const truncateAddress = (
  address: string,
  digits: number,
  closing: string = "..."
): string => {
  return `${address.substring(0, digits)}${closing}`;
};
