import express, { type RequestHandler } from 'express'
import mongoose, { type Model } from 'mongoose'
import { Activity, Leaderboard, Team, User, Workout } from './models.js'

const app = express()
const port = 8000
const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/octofit_db'
const codespaceName = process.env.CODESPACE_NAME
const apiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`

app.use(express.json())

const createCrudHandlers = (model: Model<any>): {
  list: RequestHandler
  create: RequestHandler
} => ({
  list: async (_request, response, next) => {
    try {
      response.json(await model.find().lean())
    } catch (error) {
      next(error)
    }
  },
  create: async (request, response, next) => {
    try {
      const document = await model.create(request.body)
      response.status(201).json(document)
    } catch (error) {
      next(error)
    }
  },
})

const routeModels: Array<[string, Model<any>]> = [
  ['/api/users/', User],
  ['/api/teams/', Team],
  ['/api/activities/', Activity],
  ['/api/leaderboard/', Leaderboard],
  ['/api/workouts/', Workout],
] as const

for (const [path, model] of routeModels) {
  const handlers = createCrudHandlers(model)
  app.get(path, handlers.list)
  app.post(path, handlers.create)
}

app.get('/api', (_request, response) => {
  response.json({
    name: 'Octofit Tracker API',
    apiUrl,
    routes: routeModels.map(([path]) => path),
  })
})

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
})

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error)
  response.status(400).json({ error: 'Unable to process request' })
})

async function startServer() {
  await mongoose.connect(mongoUri)
  app.listen(port, () => {
    console.log(`Octofit API listening at ${apiUrl}`)
  })
}

startServer().catch((error: unknown) => {
  console.error('Unable to start Octofit API', error)
  process.exit(1)
})