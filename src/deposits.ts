// main.js
// This is the main executable of the squid indexer.

// EvmBatchProcessor is the class responsible for data retrieval and processing.
import { EvmBatchProcessor } from "@subsquid/evm-processor";
// TypeormDatabase is the class responsible for data storage.
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { IntermediaryAccountEntity, UserDepositEntity } from "./model";
import { In } from "typeorm";

const processor = new EvmBatchProcessor()
  .setGateway("https://v2.archive.subsquid.io/network/ethereum-mainnet")
  .setRpcEndpoint({
    url: "https://eth-mainnet.public.blastapi.io",
    rateLimit: 10,
  })
  .setFinalityConfirmation(75)
  .setFields({
    transaction: {
      hash: true,
      from: true,
      to: true,
      value: true,
      timestamp: true,
    },
  })
  .addTransaction({
    range: {
      from: 12_000_000,
      to: 21_191_242,
    },
  });

processor.run(
  new TypeormDatabase({ supportHotBlocks: true, stateSchema: "eth_deposits" }),
  async (ctx) => {
    let transactions: UserDepositEntity[] = [];

    for (let block of ctx.blocks) {
      const intermediaries = await ctx.store.find(IntermediaryAccountEntity, {
        where: { treasury: In(block.transactions.map((t) => t.to)) },
      });
      for (let transaction of block.transactions) {
        const exists = intermediaries.find((i) => i.id === transaction.to);
        if (exists) {
          transactions.push(
            new UserDepositEntity({
              id: transaction.hash,
              userAddress: transaction.from,
              intermediary: exists,
              amount: transaction.value,
              block: BigInt(block.header.height),
              timestamp: BigInt(block.header.timestamp),
            })
          );
        }
      }
    }

    await ctx.store.insert(transactions);
  }
);
