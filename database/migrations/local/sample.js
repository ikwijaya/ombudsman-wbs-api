
/**
 * create table (m = master, a = migrations, t = transaction)
 * m_type, m_cards, m_category, m_city, a_raws, t_promo
 */

exports.up = function (knex) {
  return Promise.all([
    // knex.schema.createTable('m_type', table => {
    //   table.increments().primary();
    //   table.string('type_code')
    //   table.string('type_name').notNullable()
    //   table.string('record_status', 1).defaultTo('A')
    //   table.timestamp('created_at').defaultTo(knex.fn.now())
    //   table.timestamp('updated_at')
    //   table.charset('utf8')
    //   table.index('id')
    // }).then(() => console.log('Create table master type success'))
    //   .then(() => knex('m_type').insert(dataType).then(() => { console.log('Insert initial data to master type') })),
    // knex.schema.createTable('m_cards', table => {
    //   table.increments().primary();
    //   table.integer('type_id').notNullable().unsigned().references('id').inTable('m_type').onDelete('CASCADE').onUpdate('RESTRICT')
    //   table.string('card_id', 128)
    //   table.string('card_name')
    //   table.string('online_flag')
    //   table.string('flag')
    //   table.string('record_status', 1).defaultTo('A')
    //   table.timestamp('created_at').defaultTo(knex.fn.now())
    //   table.timestamp('updated_at')
    //   table.charset('utf8')
    //   table.index('type_id')
    // }).then(() => console.log('Create table master cards success')),
    // knex.schema.createTable('m_category', table => {
    //   table.increments().primary();
    //   table.integer('type_id').notNullable().unsigned().references('id').inTable('m_type').onDelete('CASCADE').onUpdate('RESTRICT')
    //   table.string('category_id', 128)
    //   table.string('category_name')
    //   table.string('record_status', 1).defaultTo('A')
    //   table.timestamp('created_at').defaultTo(knex.fn.now())
    //   table.timestamp('updated_at')
    //   table.charset('utf8')
    //   table.index('type_id')
    //   table.index('category_id')
    // }).then(() => console.log('Create table master category success')),
    // knex.schema.createTable('m_city', table => {
    //   table.increments().primary();
    //   table.integer('type_id').notNullable().unsigned().references('id').inTable('m_type').onDelete('CASCADE').onUpdate('RESTRICT')
    //   table.string('city_id', 128)
    //   table.string('city_name')
    //   table.string('record_status', 1).defaultTo('A')
    //   table.timestamp('created_at').defaultTo(knex.fn.now())
    //   table.timestamp('updated_at')
    //   table.charset('utf8')
    //   table.index('type_id')
    //   table.index('city_id')
    // }).then(() => console.log('Create table master city success')),
    // knex.schema.createTable('a_raws', table => {
    //   table.increments().primary();
    //   table.integer('type_id').notNullable().unsigned().references('id').inTable('m_type').onDelete('CASCADE').onUpdate('RESTRICT')
    //   table.string('promo_id')
    //   table.json('json')
    //   table.date('start_date')
    //   table.date('expired_date')
    //   table.string('record_status', 1).defaultTo('A')
    //   table.timestamp('created_at').defaultTo(knex.fn.now())
    //   table.timestamp('updated_at')
    //   table.charset('utf8')
    // }).then(() => console.log('Create table migration raws success')),
    // knex.schema.createTable('t_promo', table => {
    //   table.increments().primary();
    //   table.integer('type_id').notNullable().unsigned().references('id').inTable('m_type').onDelete('CASCADE').onUpdate('RESTRICT')
    //   table.string('promo_id', 128)
    //   table.text('title')
    //   table.text('description', 'longtext')
    //   table.string('image_url')
    //   table.string('category_code', 128)
    //   table.date('start_promo_date')
    //   table.date('end_promo_date')
    //   table.text('term_code', 'longtext')
    //   table.string('amount')
    //   table.string('record_status', 1).defaultTo('A')
    //   table.timestamp('created_at').defaultTo(knex.fn.now())
    //   table.timestamp('updated_at')
    //   table.charset('utf8')
    //   table.index('type_id')
    //   table.index('promo_id')
    // }).then(() => console.log('Create table transaction promo success')),
    // knex.schema.createTable('t_city_promo', table => {
    //   table.increments().primary();
    //   table.integer('idx_promo').notNullable().unsigned().references('id').inTable('t_promo').onDelete('CASCADE').onUpdate('RESTRICT') //JOINED WITH t_promo fields id (one2many)
    //   table.string('city_id', 128)
    //   table.string('number_location')
    //   table.string('merchant_location_code')
    //   table.string('record_status', 1).defaultTo('A')
    //   table.timestamp('created_at').defaultTo(knex.fn.now())
    //   table.timestamp('updated_at')
    //   table.charset('utf8')
    // }).then(() => console.log('Create table transaction city promo success')),
    // knex.schema.createTable('t_card_promo', table => {
    //   table.increments().primary();
    //   table.integer('idx_promo').notNullable().unsigned().references('id').inTable('t_promo').onDelete('CASCADE').onUpdate('RESTRICT') //JOINED WITH t_promo fields id (one2many)
    //   table.string('card_id', 128) //JOINED WITH m_card fields city_id (one2many)
    //   table.string('record_status', 1).defaultTo('A')
    //   table.timestamp('created_at').defaultTo(knex.fn.now())
    //   table.timestamp('updated_at')
    //   table.charset('utf8')
    // }).then(() => console.log('Create table transaction card promo success'))
  ])
};

exports.down = function (knex) {
  // return Promise.all([
  //   knex.schema.dropTableIfExists('m_type'),
  //   knex.schema.dropTableIfExists('m_category'),
  //   knex.schema.dropTableIfExists('m_cards'),
  //   knex.schema.dropTableIfExists('m_city'),
  //   knex.schema.dropTableIfExists('a_raws'),
  //   knex.schema.dropTableIfExists('t_promo'),
  //   knex.schema.dropTableIfExists('t_city_promo'),
  //   knex.schema.dropTableIfExists('t_card_promo')
  // ])
};

const dataType = [
  {
    type_code: 'CC',
    type_name: 'CREDIT CARD',
    record_status: 'A',
    created_at: new Date()
  },
  {
    type_code: 'DC',
    type_name: 'DEBIT CARD',
    record_status: 'A',
    created_at: new Date()
  },
  {
    type_code: 'ATM',
    type_name: 'ATM',
    record_status: 'A',
    created_at: new Date()
  },
  {
    type_code: 'CLICKS',
    type_name: 'CLICKS',
    record_status: 'A',
    created_at: new Date()
  },
  {
    type_code: 'GOMO',
    type_name: 'GOMOBILE',
    record_status: 'A',
    created_at: new Date()
  },
]
