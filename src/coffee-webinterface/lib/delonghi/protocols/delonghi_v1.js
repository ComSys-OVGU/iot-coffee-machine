import { DelonghiProtocol } from './delonghi_protocol'
import { Protocol } from '../protocol'
import fs from 'fs'
import yaml from 'js-yaml'

// for changes to become active, change this file here after you've saved the ksy
// it must be *unique* so here's a counter for you: 14
const delonghiKSY = fs.readFileSync('./lib/delonghi/protocols/delonghi_v1.ksy')
const delonghiV1 = yaml.safeLoad(delonghiKSY)
const protocolInstance = Protocol('delonghiV1', delonghiV1)

export class DelonghiV1 extends DelonghiProtocol {
  constructor(args) {
    super(args)
    this.protocol = protocolInstance
  }

  getSensors (validValue) {
    return validValue === true ? [
        // these sensors need to report true to be valid
        'waterspout_installed'        
      ] : [
        // these sensors need to report false to be valid
        'door_open',
        'watertank_empty',
        'groundscontainer_full'
      ]
  }

  async getIsReady () {
    return await super.getIsReady()
  }

  async getIsError () {
    return await super.getIsError() && false
  }
}
