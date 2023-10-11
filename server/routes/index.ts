import { Router } from 'express'

import type { Services } from '../services'
import baseClientRouter from './baseClientRouter'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()

  router.use(baseClientRouter(services))

  return router
}
