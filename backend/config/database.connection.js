const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
prisma.$connect()
console.log('Connected to database')

module.exports = prisma;