// Load metadata and .env.test BEFORE anything else
import 'reflect-metadata';
import { config } from 'dotenv';
import { resolve } from 'path';

const result = config({ path: resolve(__dirname, '../../.env.test') });

if (result.error) {
  console.error('❌ Failed to load .env.test:', result.error);
} else {
  console.log('✅ E2E environment loaded from .env.test');
}
