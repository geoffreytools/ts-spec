import {} from '../src/index.js'

declare module '../src/index.js' {
    interface Config {
        strictOptionalProperties: false
    }
}