import fastify from 'fastify'
import { knex } from './database'

export const app = fastify()

app.get('/', async () => {
  const meals = await knex('meals').select('*')

  return { meals }
})
