import { ethers } from 'ethers';

const URL = 'https://bsc-testnet.infura.io/v3/76d6ec90a58e4984adea4d341e6b8de7';
const provider = new ethers.JsonRpcProvider(URL);

const routerAddress = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1'; // Contract address on BSC Testnet
const routerAbi = [
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
];

async function buyTokens(wallets, tokenAddress) {
  for (const { privateKey } of wallets) {
    const wallet = new ethers.Wallet(privateKey, provider);

    const router = new ethers.Contract(routerAddress, routerAbi, wallet);

    const path = [
      '0xD8BaB9fba6870c84439798f6a4A8293E2b6D4f80', // WBNB Testnet address
      tokenAddress,
    ];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const value = ethers.parseEther('0.004'); // swap ~0.004 BNB

    try {
      const tx = await router.swapExactETHForTokens(
        0n, // amountOutMin, 0 for simplicity
        path,
        wallet.address,
        deadline,
        { value }
      );

      console.log(`Buy tx sent: ${tx.hash}`);

      await tx.wait();
    } catch (error) {
      console.error(
        'Buy error for',
        wallet.address,
        ':',
        error.reason || error
      );
    }
  }
}

export default buyTokens;
