# Cryptocurrency Quote Calculator

A simple web application for checking cryptocurrency prices in different currencies. The user selects a fiat currency, chooses a cryptocurrency, enters an amount, and receives the current price, daily high, daily low, 24-hour change, and the amount of cryptocurrency they can buy.

## Features

- Supports Bitcoin Cash, Bitcoin, Ethereum, and Litecoin.
- Supports US Dollars, Euros, and Argentine Pesos.
- Shows current price, highest price, lowest price, and 24-hour percentage change.
- Calculates how much cryptocurrency can be purchased with the entered amount.
- Uses Binance data for cryptocurrency prices.
- Validates empty, invalid, and non-positive amounts.
- Displays an error message when a quote cannot be retrieved.
- Includes a responsive visual layout with a background image and Bitcoin image.
- Uses Binance directly for price, high, low and 24h variation.

## Technologies Used

- **HTML5:** Page structure, form controls, labels, options, and results area.
- **CSS3:** Layout, colors, responsive design, image positioning, transparency effects, and button states.
- **JavaScript:** Form events, validation, Binance API requests, calculations, and dynamic HTML updates.
- **Binance REST API:** Cryptocurrency market data.

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
const getTicker = async (cryptoSelected, coinSelected) => {
  const response = await fetch(
    `https://api.binance.com/api/v3/ticker/24hr?symbol=${cryptoSelected}${coinSelected}`
  );

  if (!response.ok) {
    throw new Error(`Par no disponible: ${cryptoSelected}${coinSelected}`);
  }

  return response.json();
};
```

This function receives the selected cryptocurrency and fiat currency, builds the Binance pair, and requests the 24-hour market data.

- `async` allows asynchronous requests.
- `await fetch(...)` waits for Binance to respond.
- `response.ok` checks whether the HTTP request was successful.
- `response.json()` converts the response into a JavaScript object.
- `throw new Error(...)` stops the execution when the trading pair is unavailable.

### 3. Reading the quote

```js
const data = await getTicker(cryptoSelected, coinSelected);
const price = Number(data.lastPrice);
const high = Number(data.highPrice);
const low = Number(data.lowPrice);
const change = Number(data.priceChangePercent);
const quantity = amountValue / price;
```

The code reads the values returned by Binance and extracts:

- current price
- daily high
- daily low
- 24-hour percentage change
- number of coins the user can buy

### 4. Listening for form submission

```js
form.addEventListener('submit', async e => {
  e.preventDefault();
```

The `submit` event runs when the user clicks `Get Quote`.

`preventDefault()` stops the browser from reloading the page, allowing the quote to be retrieved dynamically with JavaScript.

### 5. Reading the selected values

```js
const coinSelected = coin.value;
const cryptoSelected = crypto.value;
const amountValue = Number(amount.value);
```

The code obtains:

- the selected fiat currency
- the selected cryptocurrency
- the entered amount converted to a number

### 6. Validating the form

```js
if (!coinSelected || !cryptoSelected || !Number.isFinite(amountValue) || amountValue <= 0) {
  coinInfo.innerHTML = '<p>Please complete all fields.</p>';
  return;
}
```

The quote is rejected when:

- no fiat currency is selected
- no cryptocurrency is selected
- the amount is not a valid number
- the amount is zero or negative

`return` stops the function before making unnecessary API requests.

### 7. Updating the interface

After receiving the data, JavaScript replaces the content of `#coin-info`:

```js
coinInfo.innerHTML = `
  <p>Current price <span class="price">${price.toFixed(2)} ${coinSelected}</span></p>
  <p>Highest price <span class="price">${high.toFixed(2)} ${coinSelected}</span></p>
  <p>Lowest price <span class="price">${low.toFixed(2)} ${coinSelected}</span></p>
  <p>24-hour change <span class="price">${change.toFixed(2)}%</span></p>
  <p>You can buy <span class="price">${quantity.toFixed(6)} ${cryptoSelected}</span></p>
`;
```

`toFixed(2)` formats prices with two decimal places, while `toFixed(6)` shows the crypto quantity with six decimal places.

### 8. Handling errors

```js
} catch (error) {
  console.log(error);
  coinInfo.innerHTML = '<p>The quote could not be retrieved.</p>';
}
```

The `try...catch` block handles failures caused by:

- an unavailable Binance trading pair
- a failed API request
- a network or browser connection problem

The technical error is printed to the browser console, while the user receives a clear message in the interface.

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

An internet connection is required because the application requests live data from Binance.

## Important Notes

- API responses depend on the availability of external services.
- Binance may not offer every cryptocurrency/fiat pair directly, so the code depends on the pair created from the user selection.
- For production use, API errors, loading states, and more robust numeric formatting could be expanded.

## Author

Developed by [Cristian](https://github.com/CristiandLara).
