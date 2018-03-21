import fetch from 'isomorphic-fetch'

const APIBASE = 'http://192.168.2.123:3001'

const prettyProduct = ({name, ...rest}) => ({name, ...rest, displayName: name.split('_').map(([first, ...rest]) => [first.toUpperCase(), ...rest].join('')).join(' ')})

export const API = {
  async getProducts() {
    const prods = await (await fetch(`${APIBASE}/beverages`)).json()

    return prods.map(prettyProduct).map((prod) => ({
        ...prod,
        tastes: prod.tastes.map(prettyProduct)
      })
    )
  },

  async getCurrentState() {
    return (await fetch(`${APIBASE}/currentState`)).json()
  },

  async brewBeverage(type, taste) {
    return (await fetch(`${APIBASE}/brew/hot_water/strong`, {method: 'POST'})).json()
    // return (await fetch(`${APIBASE}/brew/${type}/${taste}`, {method: 'POST'})).json()
  },

  async getHistory() {
    return (await fetch(`http://0.0.0.0:3000/api/history`)).json()
  },

  async orderBeverage(type, taste) {
    return (await fetch(`/api/order`, {
      method: 'POST',
      body: JSON.stringify({taste, type}),
      headers: {
        'content-type': 'application/json'
      }
    })).json()
  }
}