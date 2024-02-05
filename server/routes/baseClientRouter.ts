import { RequestHandler, Router } from 'express'
import { Services } from '../services'
import asyncMiddleware from '../middleware/asyncMiddleware'
import BaseClientController from '../controllers/baseClientController'

export default function baseClientRouter(services: Services): Router {
  const router = Router()

  const get = (path: string | string[], ...handlers: RequestHandler[]) =>
    router.get(
      path,
      handlers.map(handler => asyncMiddleware(handler)),
    )

  const post = (path: string | string[], ...handlers: RequestHandler[]) =>
    router.post(
      path,
      handlers.map(handler => asyncMiddleware(handler)),
    )

  const baseClientController = new BaseClientController(services.baseClientService)

  get('/', baseClientController.displayBaseClients())
  get('/clients/new', baseClientController.displayNewBaseClient())
  get('/clients/:baseClientId/deployment', baseClientController.displayEditBaseClientDeployment())
  get('/clients/:baseClientId/edit', baseClientController.displayEditBaseClient())
  get('/clients/:baseClientId', baseClientController.displayBaseClient())
  get('/clients/:baseClientId/instances/:clientId/delete', baseClientController.displayDeleteClientInstance())
  post('/', baseClientController.filterBaseClients())
  post('/clients/new', baseClientController.createBaseClient())
  post('/clients/:baseClientId/deployment', baseClientController.updateBaseClientDeployment())
  post('/clients/:baseClientId/edit', baseClientController.updateBaseClientDetails())
  post('/clients/:baseClientId/instances', baseClientController.createClientInstance())
  post('/clients/:baseClientId/instances/:clientId/delete', baseClientController.deleteClientInstance())
  return router
}
