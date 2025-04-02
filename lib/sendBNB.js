import { ethers } from 'ethers';

// BNB test-net provider by infura
const URL = 'https://bsc-testnet.infura.io/v3/76d6ec90a58e4984adea4d341e6b8de7';

const provider = new ethers.JsonRpcProvider(URL);

async function sendBNB(senderPrivateKey, recipientAddress, amountBNB) {
  try {
    const wallet = new ethers.Wallet(senderPrivateKey, provider);
    const gasPrice = await provider.getFeeData();

    console.log(`🔹 Sending ${amountBNB} BNB to ${recipientAddress}...`);

    const tx = await wallet.sendTransaction({
      to: recipientAddress,
      value: ethers.parseEther(amountBNB), // Convert BNB to Wei
      // gasLimit: 21000, // Standard gas limit for BNB transfers
      // gasPrice: gasPrice.gasPrice, // Use the current network gas price
    });

    console.log(`✅ Transaction sent! Hash: ${tx.hash}`);
    console.log(`🔹 Waiting for confirmation...`);

    await tx.wait();

    console.log(
      `✅ Transaction confirmed! View on BscScan: https://bscscan.com/tx/${tx.hash}`
    );
  } catch (error) {
    console.error(`❌ Error sending BNB: ${error.message}`);
  }
}

export default sendBNB;
