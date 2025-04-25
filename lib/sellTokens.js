import { ethers } from 'ethers';

const URL = 'https://bsc-testnet.infura.io/v3/76d6ec90a58e4984adea4d341e6b8de7';
const provider = new ethers.JsonRpcProvider(URL);

const routerAddress = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1'; // Contract address on BSC Testnet
const routerAbi = [
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
];

const tokenAbi = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
];

async function sellTokens(wallets, tokenAddress) {
  for (const { privateKey } of wallets) {
    const wallet = new ethers.Wallet(privateKey, provider);
    const router = new ethers.Contract(routerAddress, routerAbi, wallet);
    const token = new ethers.Contract(tokenAddress, tokenAbi, wallet);

    try {
      const balance = await token.balanceOf(wallet.address);

      if (balance > 0n) {
        await token.approve(routerAddress, balance);

        const path = [
          tokenAddress,
          '0xD8BaB9fba6870c84439798f6a4A8293E2b6D4f80', // WBNB Testnet address
        ];
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

        const tx = await router.swapExactTokensForETH(
          balance,
          0n,
          path,
          wallet.address,
          deadline
        );

        console.log(`Sell tx sent: ${tx.hash}`);
        await tx.wait();
      } else {
        console.log(`Wallet ${wallet.address} has no token balance to sell.`);
      }
    } catch (error) {
      console.error(
        'Sell error for',
        wallet.address,
        ':',
        error.reason || error
      );
    }
  }
}

export default sellTokens;
