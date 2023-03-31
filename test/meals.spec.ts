import { it, describe, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import { format } from 'date-fns'
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

  it('should be able to list all meals', async () => {
    const consumedAt = new Date().toISOString()

    const response = await request(app.server)
      .post('/meals')
      .send({
        name: 'Chicken with potato',
        description: 'Chicken with potato accompained by brown rice.',
        consumed_at: consumedAt,
        is_inside_diet: true,
      })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const dateOfDay = format(new Date(consumedAt), 'yyyy-MM-dd')

    expect(mealsResponse.body.meals).toEqual([
      {
        day: dateOfDay,
        meals_of_day: [
          expect.objectContaining({
            name: 'Chicken with potato',
            description: 'Chicken with potato accompained by brown rice.',
            consumed_at: consumedAt,
            is_inside_diet: true,
          }),
        ],
      },
    ])
  })

  it('should be able to get a specific meal', async () => {
    const consumedAt = new Date().toISOString()

    const response = await request(app.server)
      .post('/meals')
      .send({
        name: 'Chicken with potato',
        description: 'Chicken with potato accompained by brown rice.',
        consumed_at: consumedAt,
        is_inside_diet: true,
      })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = mealsResponse.body.meals[0].meals_of_day[0].id

    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(mealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Chicken with potato',
        description: 'Chicken with potato accompained by brown rice.',
        consumed_at: consumedAt,
        is_inside_diet: true,
      }),
    )
  })

  it('should be able to edit meal', async () => {
    const consumedAt = new Date().toISOString()

    const response = await request(app.server)
      .post('/meals')
      .send({
        name: 'Chicken with potato',
        description: 'Chicken with potato accompained by brown rice.',
        consumed_at: consumedAt,
        is_inside_diet: true,
      })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = mealsResponse.body.meals[0].meals_of_day[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Cupcake of chocolate',
        description: 'Cupcake with very chocolate!!!',
        consumed_at: consumedAt,
        is_inside_diet: false,
      })
      .expect(204)

    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(mealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Cupcake of chocolate',
        description: 'Cupcake with very chocolate!!!',
        consumed_at: consumedAt,
        is_inside_diet: false,
      }),
    )
  })
})
