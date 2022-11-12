import { ethers } from "hardhat";
import { deployLog } from "./ColoredLogs";

async function main() {
  // Stablecoin
  const Stablecoin = await ethers.getContractFactory("Stablecoin");
  const stablecoin = await Stablecoin.deploy(ethers.utils.parseEther("100"));
  await stablecoin.deployed();

  deployLog("USDM", stablecoin.address);

  // MiscanthusCore
  const MiscanthusCore = await ethers.getContractFactory("MiscanthusCore");
  const miscanthusCore = await MiscanthusCore.deploy(stablecoin.address);
  await miscanthusCore.deployed();

  deployLog("MiscanthusCore", miscanthusCore.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
