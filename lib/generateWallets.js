import { ethers } from 'ethers';

function generateWallets(count) {
  let wallets = [];

  for (let i = 0; i < count; i++) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push({ address: wallet.address, privateKey: wallet.privateKey });
  }

  return wallets;
}

export default generateWallets;
