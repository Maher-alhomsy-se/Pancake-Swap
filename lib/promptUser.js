import { ethers } from 'ethers';
import inquirer from 'inquirer';

async function promptUser() {
  const answers = await inquirer.prompt([
    {
      type: 'number',
      name: 'count',
      message: 'Enter the number of wallets to generate:',
      validate: (value) =>
        value > 0 ? true : 'Please enter a valid number greater than zero',
    },
    {
      type: 'input',
      name: 'userAddress',
      message: 'Enter your wallet address to validate:',
      validate: (input) =>
        ethers.isAddress(input) ? true : 'Invalid wallet address!',
    },
    {
      type: 'input',
      name: 'userPrivateKey',
      message: 'Enter your private key (used to sign the transaction):',
      validate: (input) => {
        try {
          new ethers.Wallet(input);
          return true;
        } catch {
          return 'Invalid private key!';
        }
      },
    },
    {
      type: 'input',
      name: 'amountBNB',
      message:
        'How much BNB do you want to send to the first wallet generated?',
      validate: (value) =>
        parseFloat(value) > 0 ? true : 'Enter a valid positive amount.',
    },
    {
      type: 'confirm',
      name: 'continue',
      message: 'Do you want to generate more wallets?',
    },
  ]);

  return answers;
}

export default promptUser;
