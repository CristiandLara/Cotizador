# Cryptocurrency Quote Calculator

A simple web application for checking cryptocurrency prices in different currencies. The user selects a fiat currency, chooses a cryptocurrency, enters an amount, and receives the current price, daily high, daily low, 24-hour change, and the amount of cryptocurrency they can buy.

## Features

- Supports Bitcoin Cash, Bitcoin, Ethereum, and Litecoin.
- Supports US Dollars, Euros, and Argentine Pesos.
- Shows current price, highest price, lowest price, and 24-hour percentage change.
- Calculates how much cryptocurrency can be purchased with the entered amount.
- Uses Binance data for cryptocurrency prices.
- Uses ExchangeRate-API when a direct cryptocurrency/fiat pair is not available.
- Validates empty, invalid, and non-positive amounts.
- Displays an error message when a quote cannot be retrieved.
- Includes a responsive visual layout with a background image and Bitcoin image.

## Technologies Used

- **HTML5:** Page structure, form controls, labels, options, and results area.
- **CSS3:** Layout, colors, responsive design, image positioning, transparency effects, and button states.
- **JavaScript:** Form events, validation, API requests, currency conversion, calculations, and dynamic HTML updates.
- **Binance REST API:** Cryptocurrency market data.
- **ExchangeRate-API:** Fiat currency exchange rates.

## Project Structure

```text
Cotizador/
├── index.html
├── script.js
├── styles.css
├── imgbackground.jpg
├── bitcoin-removebg-preview.png
└── README.md
```

### `index.html`

Defines the visible interface:

- The page title and main heading.
- A currency selector with `USD`, `EUR`, and `ARS` values.
- A cryptocurrency selector with `BCH`, `BTC`, `ETH`, and `LTC` values.
- An amount input.
- The `Get Quote` submit button.
- The area where the quote results are displayed.
- The footer and link to the developer's GitHub profile.
- The Bitcoin image displayed beside the quote calculator.

The attribute `lang="en"` identifies English as the page language, which helps browsers and accessibility tools interpret the content correctly.

### `styles.css`

Controls the visual presentation of the application:

- Uses `imgbackground.jpg` as the full-page background.
- Centers the quote calculator on the screen.
- Gives the calculator a dark, semi-transparent panel.
- Positions the Bitcoin image outside the left side of the panel.
- Styles the currency and cryptocurrency selectors with different colors.
- Styles the green `Get Quote` button and its hover/active states.
- Adds spacing between form fields and result lines.
- Includes a media query for smaller screens.

## JavaScript Explained

The main logic is located in `script.js`.

### 1. Selecting HTML elements

```js
const form = document.querySelector('#coin-form');
const coin = document.querySelector('#coin');
const crypto = document.querySelector('#crypto');
const amount = document.querySelector('#amount');
const coinInfo = document.querySelector('#coin-info');
```

`querySelector` obtains references to the form controls and the result container. These references allow JavaScript to read user input and update the page.

### 2. Requesting market data with `getTicker`

```js
async function getTicker(symbol) {
  const response = await fetch(
    `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
  );

  if (!response.ok) {
    throw new Error(`The ${symbol} trading pair does not exist`);
  }

  return response.json();
}
```

This function receives a Binance trading pair, such as `BTCUSD` or `ETHUSDT`, and requests 24-hour market data.

- `async` allows the function to work with asynchronous requests.
- `await fetch(...)` waits for Binance to respond.
- `response.ok` checks whether the request succeeded.
- `response.json()` converts the response into a JavaScript object.
- `throw new Error(...)` interrupts the process when the trading pair is unavailable.

### 3. Getting a quote with `getQuote`

```js
async function getQuote(cryptoSelected, coinSelected) {
```

This function is responsible for finding the best available way to calculate the quote.

#### Direct trading pair

First, the application tries to request a direct pair:

```js
getTicker(`${cryptoSelected}${coinSelected}`)
```

For example:

- `BTCUSD`
- `ETHEUR`
- `LTCARS`

If Binance supports that pair, the application uses the returned values directly.

#### Fallback through USDT

Some fiat currencies do not have a direct pair on Binance. When the direct request fails, the application uses two requests in parallel:

```js
const [cryptoData, ratesResponse] = await Promise.all([
  getTicker(`${cryptoSelected}USDT`),
  fetch('https://api.exchangerate-api.com/v4/latest/USD')
]);
```

The process is:

1. Get the cryptocurrency price in USDT from Binance.
2. Get the USD exchange rates from ExchangeRate-API.
3. Find the selected fiat currency rate.
4. Multiply the cryptocurrency price by that exchange rate.

For example, when the user selects EUR:

```text
Crypto price in USDT x USD-to-EUR rate = Crypto price in EUR
```

The same conversion is applied to the highest and lowest prices. The 24-hour percentage change remains the value provided by Binance.

### 4. Listening for form submission

```js
form.addEventListener('submit', async e => {
  e.preventDefault();
```

The `submit` event runs when the user clicks `Get Quote`.

`preventDefault()` stops the browser from reloading the page, allowing the quote to be retrieved dynamically with JavaScript.

### 5. Reading the selected values

```js
const coinSelected = [...coin.options]
  .find(option => option.selected)?.value;
const cryptoSelected = [...crypto.options]
  .find(option => option.selected)?.value;
const amountValue = Number(amount.value);
```

The code obtains:

- The selected fiat currency.
- The selected cryptocurrency.
- The entered amount converted to a number.

The spread operator converts the `<option>` collection into an array, allowing the use of `.find()`.

### 6. Validating the form

```js
if (
  !coinSelected ||
  !cryptoSelected ||
  !Number.isFinite(amountValue) ||
  amountValue <= 0
) {
  coinInfo.innerHTML = '<p>Please complete all fields.</p>';
  return;
}
```

The quote is rejected when:

- No fiat currency was selected.
- No cryptocurrency was selected.
- The amount is not a valid number.
- The amount is zero or negative.

`return` stops the function before making unnecessary API requests.

### 7. Calculating the amount of cryptocurrency

```js
const { price, high, low, change } = await getQuote(
  cryptoSelected,
  coinSelected
);
const quantity = amountValue / price;
```

The entered fiat amount is divided by the cryptocurrency price:

```text
Cryptocurrency quantity = Entered amount / Cryptocurrency price
```

Example:

```text
100 USD / 50,000 USD per BTC = 0.002 BTC
```

### 8. Updating the interface

After receiving the data, JavaScript replaces the content of `#coin-info` with a template literal:

```js
coinInfo.innerHTML = `
  <p>Current price ...</p>
  <p>Highest price ...</p>
  <p>Lowest price ...</p>
  <p>24-hour change ...</p>
  <p>You can buy ...</p>
`;
```

`toFixed(2)` formats prices with two decimal places, while `toFixed(6)` shows the cryptocurrency quantity with six decimal places.

### 9. Handling errors

```js
} catch (error) {
  console.log(error);
  coinInfo.innerHTML = '<p>The quote could not be retrieved.</p>';
}
```

The `try...catch` block handles failures caused by:

- An unavailable Binance trading pair.
- A failed API request.
- A missing exchange rate.
- A network or browser connection problem.

The technical error is printed to the browser console, while the user receives a clear message in the interface.

## Running the Project

This is a static web project, so no package installation is required.

1. Open the project folder in Visual Studio Code.
2. Open `index.html` in a browser, or use the Live Server extension.
3. Select a currency and cryptocurrency.
4. Enter a positive amount.
5. Click `Get Quote`.

An internet connection is required because the application requests live data from Binance and ExchangeRate-API.

## Important Notes

- API responses depend on the availability of external services.
- Binance may not provide every cryptocurrency/fiat pair directly, which is why the USDT conversion fallback exists.
- The `cryptoIds` object is currently defined in `script.js` but is not used by the current calculation flow. It can be removed or used later if the project adds another cryptocurrency API.
- For production use, API errors, rate limits, loading states, and more robust numeric formatting could be expanded.

## Author

Developed by [Cristian](https://github.com/CristiandLara).
