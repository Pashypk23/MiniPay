/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false
    }
    return config
  }
}

module.exports = nextConfig
document.getElementById('sendForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  
  const recipient = document.getElementById('recipient').value;
  const amount = document.getElementById('amount').value;

  // Connecting to Celo Testnet
  if (window.celo) {
      try {
          await window.celo.enable();
          const web3 = new Web3(window.celo);
          const kit = new CeloContractKit(web3);

          const accounts = await kit.web3.eth.getAccounts();
          const sender = accounts[0];

          const tx = await kit.sendTransaction({
              from: sender,
              to: recipient,
              value: kit.web3.utils.toWei(amount, 'ether')
          });

          await tx.waitReceipt();

          document.getElementById('message').innerText = 'Transaction successful!';
      } catch (error) {
          document.getElementById('message').innerText = `Error: ${error.message}`;
      }
  } else {
      document.getElementById('message').innerText = 'Please install the CeloExtensionWallet.';
  }
});
