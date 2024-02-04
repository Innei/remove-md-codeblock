import fs from 'node:fs'

import tr from '../src/index.js'

const __dirname = new URL('.', import.meta.url).pathname

console.log(await tr(fs.readFileSync(__dirname + 'example.md', 'utf-8')))
