import { Delonghi } from './delonghi'
import { delonghiV1 } from './protocols'
import { DelonghiWebsocket } from './transports/websocket'

export * from './transports/browser'

export let delonghi
export const init = ({
  transport = DelonghiWebsocket,
  protocol = delonghiV1
} = {}) => {
  if (typeof delonghi !== 'undefined') {
    return
  }
  delonghi = new Delonghi(new transport(), protocol)

  typeof window !== 'undefined' && (
    window.delonghi = delonghi
  )
}
