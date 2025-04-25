import ora from 'ora';
import { ethers } from 'ethers';

async function waitForFunds(provider, address, targetAmount) {
  let receivedAmount = 0n;
  const spinner = ora('Waiting for 0.1 BNB...').start();

  while (true) {
    try {
      const balance = await provider.getBalance(address);

      if (balance > receivedAmount) {
        const diff = balance - receivedAmount;
        receivedAmount = balance;

        spinner.info(
          `New transaction received: ${ethers.formatEther(diff)} BNB`
        );

        if (receivedAmount >= targetAmount) {
          spinner.succeed(
            `Received total ${ethers.formatEther(receivedAmount)} BNB! 🎉`
          );

          return true;
        } else {
          const remaining = targetAmount - receivedAmount;

          const message = `Total received: ${ethers.formatEther(
            receivedAmount
          )} BNB. Please send additional ${ethers.formatEther(remaining)} BNB.`;

          spinner.warn(message);

          spinner.start('Waiting for the rest of the funds...');
        }
      }
    } catch (error) {
      spinner.fail('Error checking balance: ' + error.message);
      return false;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export default waitForFunds;
