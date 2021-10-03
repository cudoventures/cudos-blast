import { compile } from './lib/commandService'

export function compileCmd (argv) {
  try {
    compile()
  } catch (e) {
    console.error(`${e}`)
    console.log('Execute cudo compile --help for more info.')
  }
}
