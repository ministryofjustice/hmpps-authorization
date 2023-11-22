import { v4 as uuidv4 } from 'uuid'
import { BaseClientEvent } from './baseClientEvent'
import AuditService from '../services/auditService'

const BASE_CLIENT_SUBJECT_TYPE = 'BASE_CLIENT_ID'

const baseClientAudit = (username: string, auditService: AuditService) => {
  const correlationId = uuidv4()

  return async (baseClientEvent: BaseClientEvent, baseClientId?: string, details?: Record<string, unknown>) => {
    await auditService.sendAuditMessage({
      action: baseClientEvent,
      who: username,
      subjectId: baseClientId,
      subjectType: BASE_CLIENT_SUBJECT_TYPE,
      correlationId,
      details: JSON.stringify(details),
    })
  }
}

export default baseClientAudit
