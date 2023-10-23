import { BaseClient } from '../../interfaces/baseClientApi/baseClient'
import { Client } from '../../interfaces/baseClientApi/client'

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
        html: item.accessed.toLocaleDateString('en-GB'),
      },
      {
        html: `<a class="govuk-link" href="/baseClients/${baseClient.baseClientId}/clients/${item.clientId}/delete">delete</a>`,
      },
    ]),
    expiry: baseClient.config.expiryDate
      ? `Yes - days remaining ${calculateDaysRemaining(baseClient.config.expiryDate)}`
      : 'No',
    skipToAzureField: '',
    serviceEnabledCode: '',
  }
}

const calculateDaysRemaining = (expiryDate?: string) => {
  if (!expiryDate) {
    return 0
  }
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diff = expiry.getTime() - now.getTime()
  if (diff < 0) {
    return 0
  }
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
