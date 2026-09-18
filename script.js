const form = document.querySelector('#coin-form');
const coin = document.querySelector('#coin');
const crypto = document.querySelector('#crypto');
const amount = document.querySelector('#amount');
const coinInfo = document.querySelector('#coin-info');

const getTicker = async (cryptoSelected, coinSelected) => {
  const response = (await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${cryptoSelected}${coinSelected}`));

  if (!response.ok) {
    throw new Error(`Par no disponible: ${cryptoSelected}${coinSelected}`);
  }

  return response.json();
};

form.addEventListener('submit', async e => {
  e.preventDefault();

  const coinSelected = coin.value;
  const cryptoSelected = crypto.value;
  const amountValue = Number(amount.value);

  if (!coinSelected || !cryptoSelected || !Number.isFinite(amountValue) || amountValue <= 0) {
    coinInfo.innerHTML = '<p>Please complete all fields.</p>';
    return;
  }

  try {
    const data = await getTicker(cryptoSelected, coinSelected);
    const price = Number(data.lastPrice);
    const high = Number(data.highPrice);
    const low = Number(data.lowPrice);
    const change = Number(data.priceChangePercent);
    const quantity = amountValue / price;

    coinInfo.innerHTML = `
      <p>Current price <span class="price">${price.toFixed(2)} ${coinSelected}</span></p>
      <p>Highest price <span class="price">${high.toFixed(2)} ${coinSelected}</span></p>
      <p>Lowest price <span class="price">${low.toFixed(2)} ${coinSelected}</span></p>
      <p>24-hour change <span class="price">${change.toFixed(2)}%</span></p>
      <p>You can buy <span class="price">${quantity.toFixed(6)} ${cryptoSelected}</span></p>
    `;
  } catch (error) {
    console.log(error);
    coinInfo.innerHTML = '<p>The quote could not be retrieved.</p>';
  }
});