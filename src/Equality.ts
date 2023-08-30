import { apply, Unwrapped, unwrap, TypesMap } from 'free-types-core';

import { Fork, Any, Never, Unknown } from './utils'
import { _any, _never, _unknown } from './placeholders'

import * as Config from './Config'

export {
    Disambiguate,
    StrictReadonly,
    Failure,
    FailingTest,
    Debug,
    result
}

type Disambiguate<A, B = never> = _Disambiguate<A, Config.IfConfig<
    Config.StrictOptionalProperties & { value: B, fallback: never }
>>
declare const result: unique symbol;
type Failure<T, A, B> = Fork<Any<T>, Debug<A, B>, FailingTest<T, A, B>>
type FailingTest<T = string, A = unknown, B = unknown> = { title: T, a: A, b: B, [result]: 'fail' }
type Debug<A = unknown, B = unknown> = { a: A, b: B, [result]: 'fail' };

type Obj = { [k: PropertyKey]: unknown };
type Interface = { [k: string]: any } & { [Symbol.toStringTag]?: never }
type Constructor = new (...args: any[]) => any;
type Fn = (...args: any[]) => any;

type _Disambiguate<T, Model> =
    Any<T> extends true ? _any
    : Never<T> extends true ? _never
    : IsIntrinsic<T> extends true ? T
    : Unknown<T> extends true ? _unknown
    : {} extends SafeRequired<T> ? {} extends Model ? DisambiguateObject<{}, Model> : {}
    : T extends readonly unknown[]
    ? any[] extends T
        ? Disambiguate<T[0], 0 extends keyof Model ? Model[0] : never> extends
            infer R ? T extends unknown[] ? R[] : readonly R[]
            : never
        : DisambiguateTuple<T, Model>
    : T extends Obj ? DisambiguateObject<T, Model>
    : T extends number | string | boolean | bigint ? DisambiguateBranded<T>
    : DisambiguateOther<T, Model>

type DisambiguateTuple<T, Model> = {
    [K in keyof T]: K extends keyof [] ? T[K] : Disambiguate<T[K], K extends keyof Model ? Model[K] : never>
};

type DisambiguateObject<T, Model> =
    { [K in keyof T]: Disambiguate<T[K], K extends keyof Model ? Model[K] : never> }
        & { readonlyKeys: inferReadonlyKeys<T> }
        & Fork<Never<Model>, {}, OptionalProps<Model>>

type StrictReadonly<T> =
    T extends readonly unknown[] ? T
    : T extends Constructor | Fn ? T
    : T extends Obj | Interface ? T & { readonlyKeys: inferReadonlyKeys<T> }
    : T;

type Intrinsic =
    | Uppercase<string>
    | Lowercase<string>
    | Capitalize<string>
    | Uncapitalize<string>

type IsIntrinsic<T> = Config.IfConfig<Config.TS4_8 & { value: false, fallback: _IsIntrinsic<T> }>;

type _IsIntrinsic<T> = boolean extends (
    Intrinsic extends infer I ?
        I extends T ?
            T extends I ? true : false
        : false
    : false
) ? true : false; 

type DisambiguateOther<
    T, Model,
    U extends Unwrapped = unwrap<T, TypesMap>,
> = ([U] extends [never] ? true : false) extends false
    ? apply<U['type'], DisambiguateTuple<U['args'], never>>
    : T extends Constructor ? T
    : T extends Interface ? DisambiguateObject<T, Model>
    : T;

type DisambiguateBranded<T, Tag = GetTag<T, Widen<T>>> = 
    Tag extends object ? GetRadical<T, Tag> & Disambiguate<Tag, never> : Tag

type Widen<T> =
    T extends number ? number
    : T extends string ? string
    : T extends boolean ? boolean
    : T extends bigint ? bigint
    : T;

type GetTag<T, U> = {[K in keyof T as K extends keyof U ? never : K]: T[K]}
type GetRadical<T, Tag> = T extends infer R & Tag ? R : never

type inferReadonlyKeys<T> = {
    [K in keyof T]-?: InferReadonlyKey<{[k in K]-?: T[K]}, K>
} extends infer R ? R[keyof R] : never

type InferReadonlyKey<T, K extends PropertyKey> = T extends { [k in K]: infer R }
    ? ReadonlyAwareEquals<T, { readonly [k in K]: R }> extends true ? K : never
: never;

type ReadonlyAwareEquals<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<U>() => U extends Y ? 1 : 2) ? true : false;

type SafeRequired<T> =
    T extends unknown[] ? T
    : keyof T extends never ? T
    : Required<T>;

type OptionalProps<T> = {
    [K in keyof T as {} extends { [P in K]: T[P]; } ? K : never]?: _unknown
}