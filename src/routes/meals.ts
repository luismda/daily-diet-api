import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { z } from 'zod'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string().trim().min(3),
      description: z.string().trim().min(3),
      consumed_at: z.string().datetime(),
      is_inside_diet: z.boolean(),
    })

    const schemaValidation = createMealBodySchema.safeParse(request.body)

    if (schemaValidation.success === false) {
      return reply.status(400).send({
        error: `Invalid request body: ${schemaValidation.error.message}`,
      })
    }

    const {
      name,
      description,
      consumed_at: consumedAt,
      is_inside_diet: isInsideDiet,
    } = schemaValidation.data

    let userId = request.cookies.userId

    if (!userId) {
      userId = randomUUID()

      reply.cookie('userId', userId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      })
    }

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      consumed_at: consumedAt,
      is_inside_diet: isInsideDiet,
      user_id: userId,
    })

    return reply.status(201).send()
  })
}
