const fs = require('fs');
const csv = require('csv-parser');
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-mainnet.g.alchemy.com/v2/key'));

const privateKeys = [];

fs.createReadStream('credentials.csv')
  .pipe(csv())
  .on('data', (row) => {
    privateKeys.push(row.private_key);
  })
  .on('end', async () => {
    let totalBalance = 0;
    console.log(`Total imported wallets: ${privateKeys.length}`);

    for (const [index, privateKey] of privateKeys.entries()) {
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      const balance = await web3.eth.getBalance(account.address);
      const etherBalance = web3.utils.fromWei(balance, 'ether');
      totalBalance += parseFloat(etherBalance);

      console.log(`${index + 1}. Address: ${account.address}, Balance: ${etherBalance} ETH`);

      // 等待1秒钟，以避免API限制
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`Total balance: ${totalBalance.toFixed(4)} ETH`);
  });
