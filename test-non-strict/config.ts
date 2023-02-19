import {} from '../src'

declare module '../src' {
    interface Config {
        strictOptionalProperties: false
    }
}