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

  // const post = (path: string | string[], ...handlers: RequestHandler[]) =>
  //   router.post(
  //     path,
  //     handlers.map(handler => asyncMiddleware(handler)),
  //   )

  const baseClientController = new BaseClientController(services.baseClientService)

  get('/', baseClientController.displayBaseClients())
  get('/base-clients/new', baseClientController.displayNewBaseClient())
  get('/base-clients/:baseClientId', baseClientController.displayBaseClient())

  return router
}
