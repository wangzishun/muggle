console.log('esmodule')

import { hallo } from './hallo.js'

hallo()

import('./world.js').then(({ world }) => world())
