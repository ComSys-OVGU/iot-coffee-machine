import yaml from 'js-yaml'

// for changes to become active, change this file here after you've saved the ksy
// it must be *unique* so here's a counter for you: 12
import delonghiV1KSY from './delonghi_v1.ksy'

export const delonghiV1 = yaml.safeLoad(delonghiV1KSY)
