import { config } from 'dotenv';

const env = config();

if (env.parsed) {
  for (const key in env.parsed) {
    process.env[key] = env.parsed[key];
  }
}
