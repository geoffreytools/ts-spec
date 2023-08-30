import { Eq } from './utils'

import { Disambiguate, StrictReadonly, result } from './Equality'

export type { Equal, Extends, Includes }

interface OK { [result]: 'OK' }

interface FailEqual<A, B> { [result]: [A, B]}
interface FailExtend<A, B> { [result]: [A, B]}
interface FailInclude<A, B> { [result]: [A, B]}

type Equal<
    A extends R extends true ? unknown : never,
    B,
    R = Eq<Disambiguate<A, B>, Disambiguate<B, A>>
> = R extends true ? OK : FailEqual<A, B>;

type Extends<
    A extends R extends true ? unknown : never,
    B,
    R = Disambiguate<A, B> extends StrictReadonly<B> ? true : false
> = R extends true ? OK : FailExtend<A, B>;

type Includes<
    A extends R extends true ? unknown : never,
    B,
    R = Disambiguate<B, A> extends StrictReadonly<A> ? true : false
> = R extends true ? OK : FailInclude<A, B>;