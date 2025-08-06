const hre = require("hardhat");

const { providers } = require("ethers");
const originalTransactionResponse = providers.Formatter.prototype.transactionResponse;
providers.Formatter.prototype.transactionResponse = function(transaction) {
  if (transaction.to === "") {
    transaction.to = null;
  }
  return originalTransactionResponse.call(this, transaction);
};

async function main() {
  console.log("Starting deployment...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

  const SchemaRegistry = await hre.ethers.getContractFactory("SchemaRegistry");
  console.log("Deploying SchemaRegistry...");
  
  const contract = await SchemaRegistry.deploy(deployer.address);
  console.log("Deployment transaction sent:", contract.deployTransaction.hash);
  
  console.log("Waiting for transaction to be mined...");
  const receipt = await contract.deployTransaction.wait();
  
  console.log("SchemaRegistry deployed successfully!");
  console.log("Contract address:", receipt.contractAddress);
  console.log("Transaction hash:", receipt.transactionHash);
  console.log("Gas used:", receipt.gasUsed.toString());
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});