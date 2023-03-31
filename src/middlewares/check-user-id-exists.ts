import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function checkUserIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserIdCookiesSchema = z.object({
    userId: z.string().uuid(),
  })

  const validationCookiesSchema = getUserIdCookiesSchema.safeParse(
    request.cookies,
  )

  if (validationCookiesSchema.success === false) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }
}
