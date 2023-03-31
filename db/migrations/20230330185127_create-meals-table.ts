import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').notNullable().index()
    table.string('name').notNullable()
    table.text('description').notNullable()
    table.timestamp('consumed_at').notNullable()
    table.boolean('is_inside_diet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
