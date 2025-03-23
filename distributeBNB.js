import fs from 'fs';
import { ethers } from 'ethers';

const URL = 'https://bsc-testnet.infura.io/v3/76d6ec90a58e4984adea4d341e6b8de7';

const wallets = JSON.parse(fs.readFileSync('wallets.json', 'utf-8'));

const firstWallet = wallets[0];
const filteredWallets = wallets.slice(1);

const provider = new ethers.JsonRpcProvider(URL);
const mainWallet = new ethers.Wallet(firstWallet.privateKey, provider);

async function distributeBNB() {
  for (let i = 0; i < filteredWallets.length; i++) {
    const randomAmount = (Math.random() * 0.005).toFixed(6); // Random value up to 0.005 BNB

    try {
      const tx = await mainWallet.sendTransaction({
        to: filteredWallets[i].address,
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

distributeBNB(); // distribute BNB from first generated address to other addresses
