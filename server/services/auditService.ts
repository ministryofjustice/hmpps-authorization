import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import logger from '../../logger'
import config from '../config'

export default class AuditService {
  private sqsClient: SQSClient

  constructor(
    private readonly queueUrl = config.apis.audit.queueUrl,
    private readonly enabled = config.apis.audit.enabled,
  ) {
    this.sqsClient = new SQSClient({
      region: config.apis.audit.region,
    })
  }

  async sendAuditMessage({
    action,
    who,
    subjectId,
    subjectType,
    correlationId,
    details,
    logErrors = true,
  }: {
    action: string
    who: string
    subjectId?: string
    subjectType?: string
    correlationId?: string
    details?: string
    logErrors?: boolean
  }) {
    try {
      const message = JSON.stringify({
        what: action,
        when: new Date(),
        who,
        subjectId,
        subjectType,
        correlationId,
        service: config.apis.audit.serviceName,
        details,
      })

      if (!this.enabled) {
        logger.info(`Audit is disabled - message: ${message}`)
        return
      }

      const messageResponse = await this.sqsClient.send(
        new SendMessageCommand({
          MessageBody: message,
          QueueUrl: this.queueUrl,
        }),
      )

      logger.info(`SQS message sent (${messageResponse.MessageId})`)
    } catch (error) {
      if (logErrors) {
        logger.error('Problem sending message to SQS queue', error)
      }
    }
  }
}
