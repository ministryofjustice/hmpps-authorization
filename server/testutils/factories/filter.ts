import { Factory } from 'fishery'
import { BaseClientListFilter } from '../../interfaces/baseClientApi/baseClient'

export default Factory.define<BaseClientListFilter>(() => ({
  roleSearch: '',
  clientCredentials: true,
  authorisationCode: true,
  serviceClientType: true,
  personalClientType: true,
  blankClientType: true,
}))
