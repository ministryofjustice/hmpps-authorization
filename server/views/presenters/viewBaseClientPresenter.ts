import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { Client } from '../../interfaces/baseClientApi/client'
import { daysRemaining } from '../../utils/utils'

export default (baseClient: BaseClient, clients: Client[]) => {
  return {
    clientsTable: clients.map(item => [
      {
        text: item.clientId,
      },
      {
        html: item.created.toLocaleDateString('en-GB'),
      },
      {
        html: item.accessed ? item.accessed.toLocaleDateString('en-GB') : '',
      },
      {
        html: `<a class="govuk-link" href="/base-clients/${baseClient.baseClientId}/clients/${item.clientId}/delete" data-qa='delete-client-instance-link'>delete</a>`,
      },
    ]),
    expiry: baseClient.config.expiryDate ? `Yes - days remaining ${daysRemaining(baseClient.config.expiryDate)}` : 'No',
    skipToAzureField: '',
    serviceEnabledCode: '',
  }
}
