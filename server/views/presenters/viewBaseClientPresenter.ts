import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { Client } from '../../interfaces/baseClientApi/client'
import { dateTimeFormat, daysRemaining } from '../../utils/utils'

export default (baseClient: BaseClient, clients: Client[], isReadOnly: boolean = true) => {
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
        html: isReadOnly
          ? ''
          : `<a class='govuk-link' href='/base-clients/${baseClient.baseClientId}/clients/${item.clientId}/delete' data-qa='delete-client-instance-link'>delete</a>`,
      },
    ]),
    expiry: baseClient.config.expiryDate ? `Yes - days remaining ${daysRemaining(baseClient.config.expiryDate)}` : 'No',
    skipToAzure: baseClient.authorisationCode.azureAdLoginFlow,
  }
}
