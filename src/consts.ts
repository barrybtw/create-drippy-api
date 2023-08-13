import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);

export const PKG_ROOT = path.join(distPath, '../');

export const DEFAULT_APP_NAME = 'my-awesome-api';
export const CREATE_USER_APP = 'create-user-app';
export const ASCII_REPRESENTATION = await fs.readFile(
  './src/lib/ascii.txt',
  'utf-8',
);
