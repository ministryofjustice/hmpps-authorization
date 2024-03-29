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

  const redirect = (path: string, redirectPath: string) =>
    router.get(path, (req, res) => {
      res.redirect(redirectPath)
    })

  const baseClientController = new BaseClientController(services.baseClientService)

  get('/', baseClientController.displayBaseClients())
  redirect('/base-clients', '/')
  get('/base-clients/new', baseClientController.displayNewBaseClient())
  get('/base-clients/:baseClientId/deployment', baseClientController.displayEditBaseClientDeployment())
  get('/base-clients/:baseClientId/edit', baseClientController.displayEditBaseClient())
  get('/base-clients/:baseClientId', baseClientController.displayBaseClient())
  get('/base-clients/:baseClientId/clients/:clientId/delete', baseClientController.displayDeleteClientInstance())
  post('/', baseClientController.filterBaseClients())
  post('/base-clients/new', baseClientController.createBaseClient())
  post('/base-clients/:baseClientId/deployment', baseClientController.updateBaseClientDeployment())
  post('/base-clients/:baseClientId/edit', baseClientController.updateBaseClientDetails())
  post('/base-clients/:baseClientId/clients', baseClientController.createClientInstance())
  post('/base-clients/:baseClientId/clients/:clientId/delete', baseClientController.deleteClientInstance())
  return router
}
