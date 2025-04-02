import { JSONFilePreset } from 'lowdb/node';

import sendBNB from './lib/sendBNB';
import promptUser from './lib/promptUser';
import distributeBNB from './lib/distributeBNB';
import generateWallets from './lib/generateWallets';

const defaultData = { wallets: [] };
const db = await JSONFilePreset('db.json', defaultData);

async function main() {
  const { count, userPrivateKey, amountBNB } = await promptUser();
  const wallets = generateWallets(count);

  await db.update((data) => {
    data.wallets.push(...wallets);
  });

  if (wallets.length > 0) {
    const firstWallet = wallets[0].address;

    await sendBNB(userPrivateKey, firstWallet, amountBNB);
    await distributeBNB(wallets);
  }

  console.log(`Generated ${wallets.length} wallets successfully.`);
}

main();
