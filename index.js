require("dotenv").config();

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const alchemyWeb3 = createAlchemyWeb3(process.env.ALCHEMY_SOCKET);

alchemyWeb3.eth.subscribe("newBlockHeaders", async (error, { number }) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(`Received block ${number} 📥`);

  const [block, receipts] = await Promise.all([
    getBlock(number),
    getTransactionReceipts(number),
  ]);

  console.log(`Block: ${block} \nReceipts: ${receipts}`);
});

async function getBlock(number) {
  try {
    return await alchemyWeb3.eth.getBlock(number, true);
  } catch (error) {
    return error.message;
  }
}

async function getTransactionReceipts(number) {
  try {
    const response = await alchemyWeb3.alchemy.getTransactionReceipts({
      blockNumber: alchemyWeb3.utils.numberToHex(number),
    });

    if (response !== null) {
      return response.receipts;
    }

    return response;
  } catch (error) {
    return error.message;
  }
}
