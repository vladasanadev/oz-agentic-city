// Use dynamic import for ethers.js to ensure compatibility with Next.js SSR
let ethers: typeof import("ethers");
if (typeof window !== "undefined") {
  // @ts-ignore
  ethers = require("ethers");
}
import contractABI from "./DeepfakeDetectorABI.json";

// Connect to local Hardhat node
const providerUrl = "http://localhost:8545";

// Get contract address from env
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

// Export an async function to get the contract instance
export async function getDeepfakeContract() {
  // Dynamically import ethers for SSR compatibility
  if (!ethers) {
    ethers = (await import("ethers")) as typeof import("ethers");
  }
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const signer = await provider.getSigner(0);
  return new ethers.Contract(contractAddress, contractABI, signer);
} 