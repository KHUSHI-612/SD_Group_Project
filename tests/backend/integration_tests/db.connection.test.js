const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let prisma;

beforeAll(() => {
  prisma = new PrismaClient();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Database Connection', () => {
  test('should connect to the database successfully', async () => {
    const result = await prisma.$queryRaw`SELECT 1 + 1 AS result`;
    expect(result).toBeDefined();
    expect(result[0].result).toBe(2n);
  });
});
