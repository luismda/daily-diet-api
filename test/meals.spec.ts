import { it, describe, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'Chicken with potato',
        description: 'Chicken with potato accompained by brown rice.',
        consumed_at: new Date().toISOString(),
        is_inside_diet: true,
      })
      .expect(201)
  })
})
