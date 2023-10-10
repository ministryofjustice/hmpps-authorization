export interface ListBaseClientResponseItem {
  baseClientId: string
  clientType?: string
  teamName?: string
  grantType: string
  roles?: string
  count: number
  expired?: boolean
  lastAccessed?: string
}

export interface ListBaseClientsResponse {
  clients: ListBaseClientResponseItem[]
}
