import { DatabaseInterface } from './types';
import { MockDatabase } from './mock';
import { prisma } from '../prisma';

// Determine which implementation to use based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const useMockData = process.env.USE_MOCK_DATA === 'true';

let database: DatabaseInterface;

if (isDevelopment && useMockData) {
  database = new MockDatabase();
} else {
  // We'll implement the real database adapter later
  database = new MockDatabase(); // Temporarily use mock for all environments
}

export { database };
export * from './types';