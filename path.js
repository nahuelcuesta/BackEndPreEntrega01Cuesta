import {dirname} from 'path'
import { fileURLToPath } from 'url'

export const __dirname = dirname(fileURLToPath(import.meta.url))

console.log(`path desde path ${__dirname}`);