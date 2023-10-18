import { ClientSecretsResponse } from '../../interfaces/baseClientApi/baseClientResponse'
import { ClientSecrets } from '../../interfaces/baseClientApi/baseClient'

export default (response: ClientSecretsResponse): ClientSecrets => {
  return {
    clientId: response.clientId,
    clientSecret: response.clientSecret,
    base64ClientId: response.base64ClientId,
    base64ClientSecret: response.base64ClientSecret,
  }
}
