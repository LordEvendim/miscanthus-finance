export const deployLog = (contractName: string, address: string) => {
  console.log(
    "\x1b[35m%s\x1b[0m%s\x1b[34m%s\x1b[0m",
    contractName,
    " deployed to: ",
    address
  );
};
