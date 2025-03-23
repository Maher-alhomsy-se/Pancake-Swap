import fs from 'fs';

import { ethers } from 'ethers';

const wallets = JSON.parse(fs.readFileSync('wallets.json', 'utf-8'));
const firstWallet = wallets[0];

const URL = 'https://bsc-testnet.infura.io/v3/76d6ec90a58e4984adea4d341e6b8de7';

const provider = new ethers.JsonRpcProvider(URL);
const mainWallet = new ethers.Wallet('PRIVATE_KEY', provider);

async function sendBNB(amount) {
  try {
    const tx = await mainWallet.sendTransaction({
      to: firstWallet.address,
      value: ethers.parseEther(amount.toString()),
    });

    console.log('Transaction sent:', tx.hash);
    await tx.wait();
    console.log('BNB sent successfully to:', firstWallet.address);
  } catch (error) {
    console.error('Error reading BNB ABI:', error);
  }
}

sendBNB(0.1);
