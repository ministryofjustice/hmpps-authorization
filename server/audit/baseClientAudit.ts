import { v4 as uuidv4 } from 'uuid'
import { auditService } from '@ministryofjustice/hmpps-audit-client'
import { BaseClientEvent } from './baseClientEvent'
import config from '../config'
import logger from '../../logger'

const BASE_CLIENT_SUBJECT_TYPE = 'BASE_CLIENT_ID'

export const sendBaseClientEvent = async (
  baseClientEvent: BaseClientEvent,
  baseClientId: string,
  details: Record<string, unknown>,
  username: string,
  correlationId: string,
) => {
  if (!config.apis.audit.enabled) {
    logger.info(`${baseClientEvent} - ${baseClientId} - ${JSON.stringify(details)}`)
  } else {
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

const baseClientAudit = (username: string): BaseClientAuditFunction => {
  const correlationId = uuidv4()
  return async (baseClientEvent: BaseClientEvent, baseClientId?: string, details?: Record<string, unknown>) => {
    await sendBaseClientEvent(baseClientEvent, baseClientId, details, username, correlationId)
  }
}

export default baseClientAudit

export type BaseClientAuditFunction = (
  baseClientEvent: BaseClientEvent,
  baseClientId?: string,
  details?: Record<string, unknown>,
) => Promise<void>
