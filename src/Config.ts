import {Fork, Eq, Or} from './utils'

export type ConfigOptions = 'strictOptionalProperties' | 'TS 4.8'

export interface Config {}

export type ConfigSetting = {
    option: ConfigOptions,
    enabledWith: boolean,
    enabledByDefault: boolean,
    value: unknown,
    fallback: unknown
};

export type IfConfig<T extends ConfigSetting> = Fork<
    Fork<
        Eq<T['enabledByDefault'], true>,
        Or<
            Eq<Config[T['option'] & keyof Config], T['enabledWith']>,
            Eq<Config[T['option'] & keyof Config], never>
        >,
        Eq<Config[T['option'] & keyof Config], T['enabledWith']>
    >,
    T['value'],
    T['fallback']
>

export type StrictOptionalProperties = {
    option: 'strictOptionalProperties',
    enabledWith: true,
    enabledByDefault: true
}

export type TS4_8 = {
    option: 'TS 4.8',
    enabledWith: true,
    enabledByDefault: false
}