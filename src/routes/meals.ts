import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { format } from 'date-fns'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkUserIdExists] }, async (request) => {
    const { userId } = request.cookies

    const meals = await knex('meals')
      .where('user_id', userId)
      .orderBy('consumed_at', 'desc')

    const mealsGroupedByDay = meals.reduce((acc, meal) => {
      const dateOfDay = format(new Date(meal.consumed_at), 'yyyy-MM-dd')

      const dayIndex = acc.findIndex(({ day }) => day === dateOfDay)

      const mealOfDay = {
        ...meal,
        is_inside_diet: !!meal.is_inside_diet,
      }

      if (dayIndex > -1) {
        acc[dayIndex].meals_of_day.push(mealOfDay)
      } else {
        acc.push({
          day: dateOfDay,
          meals_of_day: [mealOfDay],
        })
      }

      return acc
    }, [] as { day: string; meals_of_day: typeof meals }[])

    return { meals: mealsGroupedByDay }
  })

  app.get(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const paramsSchemaValidation = getMealParamsSchema.safeParse(
        request.params,
      )

      if (paramsSchemaValidation.success === false) {
        return reply.status(400).send({
          error: `Invalid request params: ${paramsSchemaValidation.error.message}`,
        })
      }

      const { userId } = request.cookies

      const { id } = paramsSchemaValidation.data

      const meal = await knex('meals')
        .where({
          id,
          user_id: userId,
        })
        .first()

      const mealWithIsInsideDietAsBoolean = meal
        ? {
            ...meal,
            is_inside_diet: !!meal.is_inside_diet,
          }
        : undefined

      return { meal: mealWithIsInsideDietAsBoolean }
    },
  )

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

  app.put(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const paramsSchemaValidation = getMealParamsSchema.safeParse(
        request.params,
      )

      if (paramsSchemaValidation.success === false) {
        return reply.status(400).send({
          error: `Invalid request params: ${paramsSchemaValidation.error.message}`,
        })
      }

      const createMealBodySchema = z.object({
        name: z.string().trim().min(3),
        description: z.string().trim().min(3),
        consumed_at: z.string().datetime(),
        is_inside_diet: z.boolean(),
      })

      const bodySchemaValidation = createMealBodySchema.safeParse(request.body)

      if (bodySchemaValidation.success === false) {
        return reply.status(400).send({
          error: `Invalid request body: ${bodySchemaValidation.error.message}`,
        })
      }

      const { userId } = request.cookies

      const { id } = paramsSchemaValidation.data

      const {
        name,
        description,
        consumed_at: consumedAt,
        is_inside_diet: isInsideDiet,
      } = bodySchemaValidation.data

      await knex('meals')
        .where({
          id,
          user_id: userId,
        })
        .update({
          name,
          description,
          consumed_at: consumedAt,
          is_inside_diet: isInsideDiet,
        })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const paramsSchemaValidation = getMealParamsSchema.safeParse(
        request.params,
      )

      if (paramsSchemaValidation.success === false) {
        return reply.status(400).send({
          error: `Invalid request params: ${paramsSchemaValidation.error.message}`,
        })
      }

      const { id } = paramsSchemaValidation.data

      const { userId } = request.cookies

      await knex('meals')
        .where({
          id,
          user_id: userId,
        })
        .delete()

      return reply.status(204).send()
    },
  )
}
