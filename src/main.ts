// main.js
// This is the main executable of the squid indexer.

// EvmBatchProcessor is the class responsible for data retrieval and processing.
import { EvmBatchProcessor } from "@subsquid/evm-processor";
// TypeormDatabase is the class responsible for data storage.
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { IntermediaryAccountEntity } from "./model";

export const casinos = [
  {
    name: "Shuffle",
    treasury: "0xdfaa75323fb721e5f29d43859390f62cc4b600b8" as `0x${string}`,
    chainId: 1,
    type: "evm",
  },
  {
    name: "RollBit",
    treasury: "0xef8801eaf234ff82801821ffe2d78d60a0237f97" as `0x${string}`,
    chainId: 1,
    type: "evm",
  },
  {
    name: "Rollbit",
    treasury: "0xCBD6832Ebc203e49E2B771897067fce3c58575ac",
    chainId: 1,
    type: "evm",
  },
  {
    name: "Stake",
    treasury: "0x974caa59e49682cda0ad2bbe82983419a2ecc400" as `0x${string}`,
    chainId: 1,
    type: "evm",
  },
  {
    name: "BC.game",
    treasury: "0x9D2A0e32633d9be838BFDE19d510E6aA6eB202dd" as `0x${string}`,
    chainId: 1,
    type: "evm",
  },
] as const;

const treasuries = casinos.map((c) => c.treasury);

// First we configure data retrieval.
const processor = new EvmBatchProcessor()
  .setGateway("https://v2.archive.subsquid.io/network/ethereum-mainnet")
  .setRpcEndpoint({
    url: "https://eth-mainnet.public.blastapi.io",
    rateLimit: 10,
  })
  .setFinalityConfirmation(75)
  .setFields({
    transaction: {
      from: true,
      to: true,
      value: true,
      timestamp: true,
    },
  })
  .addTransaction({
    to: treasuries,
    range: {
      from: 12_000_000,
      to: 21_191_242,
    },
  });

processor.run(
  new TypeormDatabase({
    supportHotBlocks: true,
    stateSchema: "eth_intermediaries",
  }),
  async (ctx) => {
    let transactions: IntermediaryAccountEntity[] = [];

    for (let block of ctx.blocks) {
      for (let transaction of block.transactions) {
        const exists =
          !!transactions.find((trx) => trx.id === transaction.from) ||
          !!(await ctx.store.findOneBy(IntermediaryAccountEntity, {
            id: transaction.from,
          }));

        if (!exists) {
          transactions.push(
            new IntermediaryAccountEntity({
              id: transaction.from,
              treasury: transaction.to || "0x",
            })
          );
        }
      }
    }

    await ctx.store.insert(transactions);
  }
);
