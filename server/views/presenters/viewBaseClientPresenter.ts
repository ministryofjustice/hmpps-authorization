import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { Client } from '../../interfaces/baseClientApi/client'
import { dateTimeFormat, daysRemaining } from '../../utils/utils'
import config from '../../config'

export default (baseClient: BaseClient, clients: Client[]) => {
  return {
    clientsTable: clients.map(item => [
      {
        text: item.clientId,
      },
      {
        html: item.created ? dateTimeFormat(item.created) : '',
      },
      {
        html: item.accessed ? dateTimeFormat(item.accessed) : '',
      },
      {
        html: `<a class="govuk-link" href="/clients/${baseClient.baseClientId}/instances/${item.clientId}/delete" data-qa='delete-client-instance-link'>delete</a>`,
      },
    ]),
    expiry: baseClient.config.expiryDate ? `Yes - days remaining ${daysRemaining(baseClient.config.expiryDate)}` : 'No',
    skipToAzureField: '',
    enableServiceDetails: config.enableServiceDetails,
  }
}
