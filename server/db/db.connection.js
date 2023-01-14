const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()
db.$connect()
console.log('Connected to database')

module.exports = db;