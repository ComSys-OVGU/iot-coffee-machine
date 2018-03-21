import {
  computed,
  observable,
  observe,
  action,
  reaction,
  runInAction,
  extendObservable,
  useStrict
} from 'mobx'
import { API } from '../lib/api'

useStrict(true)

import remotedev from 'mobx-remotedev'

// https://www.amazon.de/Lavazza-Caffè-Crema-Classico-1kg/dp/B000LXZSB2
const COST_PER_GRAMM = 12.34 / 1000

@remotedev
class StateClass {
  @observable products = []
  @observable currentState = {}
  @observable history = null

  @computed
  get billItems() {
    if(!this.history || this.products.length == 0) {
      return []
    }
    const prods = this.products.reduce((prev, product) => ({
      ...prev, 
      [product.name]: { product, tastes: product.tastes.reduce((pre, taste) => ({...pre, [taste.name]: taste}), {}) }
    }), {})

    return this.history.map((hist) => {
      const { tastes = {}, product } = prods[hist.type]
      return {
        ...hist, 
        product: product, 
        taste: tastes[hist.taste],
        cost: tastes[hist.taste].weight * COST_PER_GRAMM
      }
    })
  }
  @computed
  get billSum() {
    return this.billItems.reduce((sum, { cost }) => sum + cost, 0)
  }

  constructor() {
    this.getProducts()
    this.getHistory()
    this.getCurrentState()
    this.interval = setInterval(this.getCurrentState, 500)
  }

  async getHistory() {
    const history = await API.getHistory()

    runInAction('setHistory', () => {
      this.history = history
    })
  }

  async getProducts() {
    const prods = await API.getProducts()

    runInAction('setProducts', () => {
      this.products = prods
    })
  }

  @action
  getCurrentState = async () => {
    const state = await API.getCurrentState()

    runInAction('setCurrentState', () => {
      this.currentState = state
    })
  }
}

export const state = new StateClass()