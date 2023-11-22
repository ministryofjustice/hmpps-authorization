import { SQSClient } from '@aws-sdk/client-sqs'
import logger from '../../logger'
import AuditService from './auditService'

const adminId = 'some admin'
const userId = 'some user'
const userIdSubjectType = 'USER_ID'
const someCorrelationId = 'some correlation ID'

describe('Audit service', () => {
  describe('enabled mode', () => {
    const auditService = new AuditService('http://localhost:4566/000000000000/mainQueue', true)

    beforeEach(() => {
      jest.resetAllMocks()
    })

    const functionArgs = {
      adminId: 'some admin',
      subjectId: userId,
      logErrors: true,
    }
    it('sends audit message', async () => {
      jest.spyOn(SQSClient.prototype, 'send').mockResolvedValue({} as never)
      const expectedWhat = 'DISABLE_USER'

      jest.spyOn(SQSClient.prototype, 'send').mockResolvedValue({} as never)
      await auditService.sendAuditMessage({
        action: 'DISABLE_USER',
        who: adminId,
        subjectId: userId,
        subjectType: userIdSubjectType,
        correlationId: someCorrelationId,
        details: JSON.stringify({ something: 'some details' }),
      })

      const { MessageBody, QueueUrl } = (SQSClient.prototype.send as jest.Mock).mock.calls[0][0].input
      const { what, when, who, service, subjectId, subjectType, correlationId, details } = JSON.parse(MessageBody)

      expect(QueueUrl).toEqual('http://localhost:4566/000000000000/mainQueue')
      expect(what).toEqual(expectedWhat)
      expect(when).toBeDefined()
      expect(who).toEqual(adminId)
      expect(subjectId).toEqual(subjectId)
      expect(subjectType).toEqual(userIdSubjectType)
      expect(correlationId).toEqual(someCorrelationId)
      expect(service).toEqual('authorization-ui')
      expect(details).toEqual('{"something":"some details"}')
    })

    it('logs out errors if logErrors is true', async () => {
      const err = new Error('SQS queue not found')
      jest.spyOn(SQSClient.prototype, 'send').mockRejectedValue(err as never)
      jest.spyOn(logger, 'error')
      await auditService.sendAuditMessage({ action: 'TEST', who: 'someone', logErrors: true })
      expect(logger.error).toHaveBeenCalledWith('Problem sending message to SQS queue', err)
    })

    it('does not log out errors if logErrors is false', async () => {
      functionArgs.logErrors = false
      jest.spyOn(SQSClient.prototype, 'send').mockRejectedValue(new Error('SQS queue not found') as never)
      jest.spyOn(logger, 'error')
      await auditService.sendAuditMessage({ action: 'TEST', who: 'someone', logErrors: false })
      expect(logger.error).not.toHaveBeenCalled()
    })
  })

  describe('disabled mode', () => {
    const auditService = new AuditService('http://localhost:4566/000000000000/mainQueue', false)

    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('sends audit messages to the logger', async () => {
      jest.spyOn(SQSClient.prototype, 'send').mockResolvedValue({} as never)
      jest.spyOn(logger, 'info')

      await auditService.sendAuditMessage({ action: 'TEST', who: 'someone', logErrors: false })

      expect(SQSClient.prototype.send).not.toHaveBeenCalled()
      expect(logger.info).toHaveBeenCalled()
    })
  })
})
