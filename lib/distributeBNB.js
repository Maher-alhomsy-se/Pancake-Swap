import { ethers } from 'ethers';

const URL = 'https://bsc-testnet.infura.io/v3/76d6ec90a58e4984adea4d341e6b8de7';
const provider = new ethers.JsonRpcProvider(URL);

function generateRandomDistribution(walletCount, totalAmount, minPerWallet) {
  const randoms = Array.from({ length: walletCount }, () => Math.random());
  const totalRandom = randoms.reduce((a, b) => a + b, 0);

  // Scale randoms so that each is at least minPerWallet
  const scaled = randoms.map((r) =>
    BigInt(
      Math.floor(
        (r / totalRandom) *
          Number(totalAmount - minPerWallet * BigInt(walletCount))
      )
    )
  );
  const result = scaled.map((s) => s + minPerWallet);

  // Adjust last wallet to fix rounding
  const actualSum = result.reduce((a, b) => a + b, 0n);
  const diff = totalAmount - actualSum;
  result[result.length - 1] += diff;

  return result;
}

async function distributeBNB(wallets) {
  const firstWallet = wallets[0].privateKey;
  const mainWallet = new ethers.Wallet(firstWallet, provider);

  const totalAmount = ethers.parseEther('0.1');
  const minPerWallet = ethers.parseEther('0.005');

  const distribution = generateRandomDistribution(
    wallets.length - 1,
    totalAmount,
    minPerWallet
  );

  console.log('\n📤 Starting distribution...');

  for (let i = 1; i < wallets.length; i++) {
    try {
      const tx = await mainWallet.sendTransaction({
        to: wallets[i].address,
        value: distribution[i - 1],
      });

      console.log(
        `Sent ${ethers.formatEther(distribution[i - 1])} BNB to ${
          wallets[i].address
        } (TX: ${tx.hash})`
      );
      await tx.wait();
    } catch (error) {
      console.error('Error sending BNB to', wallets[i].address, ':', error);
    }
  }

  console.log('\n✅ Distribution complete!');
}

export default distributeBNB;
