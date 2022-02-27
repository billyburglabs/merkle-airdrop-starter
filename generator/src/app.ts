import fs from "fs"; // Filesystem
import path from "path"; // Path routing
import Generator from "./generator"; // Generator
import { logger } from "./utils/logger"; // Logging

// Config file paths
const ethereumConfigPath: string = path.join(__dirname, "../ethereumConfig.json");
const polygonConfigPath: string = path.join(__dirname, "../polygonConfig.json");

/**
 * Throws error and exists process
 * @param {string} erorr to log
 */
function throwErrorAndExit(error: string): void {
  logger.error(error);
  process.exit(1);
}

async function generateEthereum(): Promise<void> {
  // Check if config exists
  if (!fs.existsSync(ethereumConfigPath)) {
    throwErrorAndExit("Missing ethereumConfig.json. Please add.");
  }

  // Read config
  const configFile: Buffer = await fs.readFileSync(ethereumConfigPath);
  const configData = JSON.parse(configFile.toString());

  // Check if config contains airdrop key
  if (configData["airdrop"] === undefined) {
    throwErrorAndExit("Missing airdrop param in config. Please add.");
  }

  // Collect config
  const decimals: number = configData.decimals ?? 18;
  const airdrop: Record<string, number> = configData.airdrop;

  // Initialize and call generator
  const generator = new Generator(decimals, airdrop, path.join(__dirname, "../ethereumMerkle.json"));
  await generator.process();
}

async function generatePolygon(): Promise<void> {
  // Check if config exists
  if (!fs.existsSync(polygonConfigPath)) {
    throwErrorAndExit("Missing polygonConfig.json. Please add.");
  }

  // Read config
  const configFile: Buffer = await fs.readFileSync(polygonConfigPath);
  const configData = JSON.parse(configFile.toString());

  // Check if config contains airdrop key
  if (configData["airdrop"] === undefined) {
    throwErrorAndExit("Missing airdrop param in config. Please add.");
  }

  // Collect config
  const decimals: number = configData.decimals ?? 18;
  const airdrop: Record<string, number> = configData.airdrop;

  // Initialize and call generator
  const generator = new Generator(decimals, airdrop, path.join(__dirname, "../polygonMerkle.json"));
  await generator.process();
}

// run ethereum + polygon scripts
(async () => {
  await generateEthereum();
  await generatePolygon();
})();
