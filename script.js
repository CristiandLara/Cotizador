// Selectores
const form = document.querySelector('#coin-form');
const coin = document.querySelector('#coin');
const crypto = document.querySelector('#crypto');
const amount = document.querySelector('#amount');
const coinInfo = document.querySelector('#coin-info');

const cryptoIds = {
  BCH: 'bitcoin-cash',
  BTC: 'bitcoin',
  ETH: 'ethereum',
  LTC: 'litecoin'
};

async function getTicker(symbol) {
  const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);

  if (!response.ok) {
    throw new Error(`No existe el par ${symbol}`);
  }

  return response.json();
}

async function getQuote(cryptoSelected, coinSelected) {
  try {
    const data = await getTicker(`${cryptoSelected}${coinSelected}`);
    return {
      price: Number(data.lastPrice),
      high: Number(data.highPrice),
      low: Number(data.lowPrice),
      change: Number(data.priceChangePercent)
    };
  } catch {
    if (coinSelected === 'USDT') {
      throw new Error('No se pudo obtener la cotización');
    }

    const [cryptoData, ratesResponse] = await Promise.all([
      getTicker(`${cryptoSelected}USDT`),
      fetch('https://api.exchangerate-api.com/v4/latest/USD')
    ]);
    const rates = await ratesResponse.json();
    const exchangeRate = coinSelected === 'USD' ? 1 : rates.rates?.[coinSelected];

    if (!exchangeRate) {
      throw new Error(`No hay tipo de cambio para ${coinSelected}`);
    }

    return {
      price: Number(cryptoData.lastPrice) * exchangeRate,
      high: Number(cryptoData.highPrice) * exchangeRate,
      low: Number(cryptoData.lowPrice) * exchangeRate,
      change: Number(cryptoData.priceChangePercent)
    };
  }
}

// Eventos
form.addEventListener('submit', async e => {
  e.preventDefault();

  const coinSelected = [...coin.options].find(option => option.selected)?.value;
  const cryptoSelected = [...crypto.options].find(option => option.selected)?.value;
  const amountValue = Number(amount.value);

  if (!coinSelected || !cryptoSelected || !Number.isFinite(amountValue) || amountValue <= 0) {
    coinInfo.innerHTML = '<p>Completa todos los campos.</p>';
    return;
  }

  try {
    const { price, high, low, change } = await getQuote(cryptoSelected, coinSelected);
    const quantity = amountValue / price;

    coinInfo.innerHTML = `
      <p>El precio es <span class="price">${price.toFixed(2)} ${coinSelected}</span></p>
      <p>El precio más alto es <span class="price">${high.toFixed(2)} ${coinSelected}</span></p>
      <p>El precio más bajo es <span class="price">${low.toFixed(2)} ${coinSelected}</span></p>
      <p>Variación 24H <span class="price">${change.toFixed(2)}%</span></p>
      <p>Puedes comprar <span class="price">${quantity.toFixed(6)} ${cryptoSelected}</span></p>
    `;
  } catch (error) {
    console.log(error);
    coinInfo.innerHTML = '<p>No se pudo obtener la cotización.</p>';
  }
});