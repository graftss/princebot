import { readFileSync } from 'fs';
import { join } from 'path';

const tokenPath: string = join(__dirname, '../token');
const token: string = readFileSync(tokenPath).toString().trim();

export const getToken = (): string => token;
