import fs from 'fs';
import { ethers } from 'ethers';

function generateWallets(count) {
  let wallets = [];

  for (let i = 0; i < count; i++) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push({ address: wallet.address, privateKey: wallet.privateKey });
  }

  return wallets;
}

const wallets = generateWallets(20);
fs.writeFileSync('wallets.json', JSON.stringify(wallets, null, 2));

console.log(`Generated ${wallets.length} wallets successfully.`);
