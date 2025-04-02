import { ethers } from 'ethers';

const URL = 'https://bsc-testnet.infura.io/v3/76d6ec90a58e4984adea4d341e6b8de7';

const provider = new ethers.JsonRpcProvider(URL);

async function distributeBNB(wallets) {
  const firstWallet = wallets[0].privateKey;

  const mainWallet = new ethers.Wallet(firstWallet, provider);

  for (let i = 1; i < wallets.length; i++) {
    const randomAmount = (Math.random() * 0.005).toFixed(6); // Random value up to 0.005 BNB

    try {
      const tx = await mainWallet.sendTransaction({
        to: wallets[i].address,
        value: ethers.parseEther(randomAmount.toString()),
      });

      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('BNB sent successfully to:', firstWallet.address);
    } catch (error) {
      console.error('Error sending BNB:', error);
    }
  }
}

export default distributeBNB;
