const hre = require("hardhat");

async function main() {
  const BadgerToken = await hre.ethers.getContractFactory("BadgerToken");
  const badgerToken = await BadgerToken.deploy(1000000);

  await badgerToken.deployed();

  console.log("Badger Token successfully deployed to: ", badgerToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
