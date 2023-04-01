// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      name: string
      description: string
      consumed_at: string
      is_inside_diet: boolean
      user_id: string
      created_at: string
      updated_at: string
    }
  }
}
