// Selectores 
const form  = document.querySelector('#coin-form')
const coin = document.querySelector('#coin')
const crypto  = document.querySelector('#crypto')
const amount = document.querySelector('#amount')
const coinInfo = document.querySelector('#coin-info')

// Eventos

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const coinselected = [...coin.children].find(option => option.selected).value;
    const cryptoselected = [...crypto.children].find(option => option.selected).value;
    const amountValue = amount.value;
    console.log(coinselected, cryptoselected, amountValue)

})