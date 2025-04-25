import { ethers } from 'ethers';
import inquirer from 'inquirer';
import { JSONFilePreset } from 'lowdb/node';

import buyTokens from './buyTokens.js';
import sellTokens from './sellTokens.js';
import waitForFunds from './lib/waitForFunds.js';
import distributeBNB from './lib/distributeBNB.js';

const URL = 'https://bsc-testnet.infura.io/v3/76d6ec90a58e4984adea4d341e6b8de7';

const defaultData = { wallets: [] };
const db = await JSONFilePreset('db.json', defaultData);

async function main() {
  try {
    const provider = new ethers.JsonRpcProvider(URL);

    const { walletCount } = await inquirer.prompt([
      {
        type: 'number',
        name: 'walletCount',
        message: 'How many wallets do you want to generate?',
        validate: (value) =>
          value > 0 || 'You must generate at least one wallet',
      },
    ]);

    const wallets = Array.from({ length: walletCount }, () =>
      ethers.Wallet.createRandom()
    ).map(({ address, privateKey }) => ({ address, privateKey }));

    await db.update((data) => {
      data.wallets.push(...wallets);
    });

    console.log('\nFirst wallet address:', wallets[0].address);
    console.log('Please send **0.1 BNB** to this address.\n');

    const isRecivedFunds = await waitForFunds(
      provider,
      wallets[0].address,
      ethers.parseEther('0.1')
    );

    if (isRecivedFunds) {
      await distributeBNB(wallets);

      const { tokenAddress } = await inquirer.prompt([
        {
          type: 'input',
          name: 'tokenAddress',
          message: 'Enter token address to BUY/SELL:',
        },
      ]);

      console.log('\nBuying tokens...\n');
      await buyTokens(wallets, tokenAddress);

      console.log('\nSelling tokens back...\n');
      await sellTokens(wallets, tokenAddress);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

main();
