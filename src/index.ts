import { apply, Unwrapped, unwrap, TypesMap, Type, A } from 'free-types-core';

// Config 

export type { Config }

type ConfigOptions = 'strictOptionalProperties' | 'TS 4.8'

interface Config {}

type ConfigSetting = {
    option: ConfigOptions,
    enabledWith: boolean,
    enabledByDefault: boolean,
    value: unknown,
    fallback: unknown
};

type IfConfig<T extends ConfigSetting> = Fork<
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

type StrictOptionalProperties = {
    option: 'strictOptionalProperties',
    enabledWith: true,
    enabledByDefault: true
}

type TS4_8 = {
    option: 'TS 4.8',
    enabledWith: true,
    enabledByDefault: false
}

type Disambiguate<A, B> = _Disambiguate<A, IfConfig<
    StrictOptionalProperties & { value: B, fallback: never }
>>

// direct type-level API

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
    R = Disambiguate<A, B> extends B ? true : false
> = R extends true ? OK : FailExtend<A, B>;

type Includes<
    A extends R extends true ? unknown : never,
    B,
    R = Disambiguate<B, A> extends A ? true : false
> = R extends true ? OK : FailInclude<A, B>;

// fully-featured API

export { test, debug, _, Context }

const test = <T extends string & CheckT, C = Context<T>, CheckT = Title<T>>
    (title: T, callback: (t: C) => PassingTest | PassingTest[]) => {}

const debug = (callback: (t: Context<any>) => PassingTest | PassingTest[]) => {}

const _ = null as unknown;

type Title<T> = Fork<DoesExtend<T, string>, ConstString<T>, string>;
type ConstString<T> = Fork<Eq<T, string>, { [missing]: 'as const' }, T>;
declare const missing: unique symbol;

type PassingTest = boolean | ((a: any) => boolean);

type BinaryTest<T extends string, $F extends $BinaryAssertion> = {
    <A>(...a: [A] | []): <B>(...b: [B] | []) => apply<$F, [T, A, B]>
    <A, B>(..._: [] | [A, B]): apply<$F, [T, A, B]>
}

type Context<T extends string> = {
    equal: BinaryTest<T, $Equality<true>>,
    extends: BinaryTest<T, $LeftEquality<true>>,
    includes: BinaryTest<T, $RightEquality<true>>,
    any: <A>(a?: A) => Test<T, A, any, true, Any<A>>,
    unknown: <A>(a?: A) => Test<T, A, unknown, true, Unknown<A>>,
    never: <A>(a?: A) => Test<T, A, never, true, Never<A>>,
    true: <A>(a?: A) => Test<T, A, true, true, True<A>>,
    false: <A>(a?: A) => Test<T, A, false, true, False<A>>
    not: {
        equal: BinaryTest<T, $Equality<false>>,
        extends: BinaryTest<T, $LeftEquality<false>>,
        includes: BinaryTest<T, $RightEquality<false>>,
        any: <A>(a?: A) => Test<T, A, any, false, Any<A>>,
        unknown:  <A>(a?: A) => Test<T, A, unknown, false, Unknown<A>>,
        never: <A>(a?: A) => Test<T, A, never, false, Never<A>>
        true: <A>(a?: A) => Test<T, A, true, false, True<A>>,
        false: <A>(a?: A) => Test<T, A, false, false, False<A>>
    }
}

interface $BinaryAssertion extends
    Type<[string, unknown, unknown], PassingTest | FailingTest | Debug>
        { Title: A<this>, A: this[1], B: this[2] }

interface $Equality<Accept extends boolean> extends $BinaryAssertion {
    type: Test<this['Title'], this['A'], this['B'], Accept,
        Eq<Disambiguate<this['A'], this['B']>, Disambiguate<this['B'], this['A']>>>
}

interface $LeftEquality<Accept extends boolean> extends $BinaryAssertion {
    type: Test<this['Title'], this['A'], this['B'], Accept,
        DoesExtend<Disambiguate<this['A'], this['B']>, this['B']>>
}

interface $RightEquality<Accept extends boolean> extends $BinaryAssertion {
    type: Test<this['Title'], this['A'], this['B'], Accept,
        DoesExtend<Disambiguate<this['B'], this['A']>, this['A']>>
}

type Test<Title extends string, A, B, Accept, R> =
    Either<Eq<R, Accept>, Failure<Title, A, B>>

// Common

export type { _never, _any, _unknown, TypesMap }

declare const result: unique symbol;
type Failure<T, A, B> = Fork<Any<T>, Debug<A, B>, FailingTest<T, A, B>>
type FailingTest<T = string, A = unknown, B = unknown> = { title: T, a: A, b: B, [result]: 'fail' }
type Debug<A = unknown, B = unknown> = { a: A, b: B, [result]: 'fail' };
type Valid<T> = Not<Or<AnyOrUnknown<T>, Never<T>>>;
type AnyOrUnknown<T> = Eq<T, unknown>;

type Never<T> = DoesExtend<T, never>;
type True<T> = And<Valid<T>, DoesExtend<T, true>>;
type False<T> = And<Valid<T>, DoesExtend<T, false>>;

type Either<A, B> = A extends false ? B : A;
type And<A, B> = Fork<A, Fork<B, B, false>, false>;
type Or<A, B> = Fork<A, A, Fork<B, B, false>>;
type Fork<P, T, F> = P extends false ? F : T;
type Not<T> = DoesExtend<T, false>;

declare const thing: unique symbol;
type anything = typeof thing;
type DoesExtend<A, B> = [A] extends [B] ? true : false;
type Any<T> = DoesExtend<T | anything, T & anything>
type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false;
type Unknown<T> = unknown extends T ? Any<T> extends false ? true : false : false;

declare const _any: unique symbol;
declare const _never: unique symbol;
declare const _unknown: unique symbol;

type _any = typeof _any;
type _never = typeof _never;
type _unknown = typeof _unknown;

type Tuple = readonly [] | readonly [unknown?] | readonly [unknown, ...unknown[]];

type _Disambiguate<T, Model> =
    Any<T> extends true ? _any
    : Never<T> extends true ? _never
    : IsIntrinsic<T> extends true ? T
    : {} extends SafeRequired<T> ? {}
    : Unknown<T> extends true ? _unknown
    : T extends readonly unknown[]
    ? any[] extends T
        ? Disambiguate<T[0], 0 extends keyof Model ? Model[0] : never> extends
            infer R ? T extends unknown[] ? R[] : readonly R[]
            : never
        : DisambiguateTuple<T, Model>
    : T extends { [k: PropertyKey]: unknown } ? DisambiguateObject<T, Model>
    : T extends number | string | boolean | bigint ? DisambiguateBranded<T>
    : DisambiguateOther<T, Model>

type DisambiguateTuple<T, Model> = {
    [K in keyof T]: K extends keyof [] ? T[K] : Disambiguate<T[K], K extends keyof Model ? Model[K] : never>
};

type DisambiguateObject<T, Model> =
    { [K in keyof T]: Disambiguate<T[K], K extends keyof Model ? Model[K] : never> }
        & { readonlyKeys: inferReadonlyKeys<T> }
        & Fork<Never<Model>, {}, OptionalProps<Model>>

type Intrinsic =
    | Uppercase<string>
    | Lowercase<string>
    | Capitalize<string>
    | Uncapitalize<string>

type IsIntrinsic<T> = IfConfig<TS4_8 & { value: false, fallback: _IsIntrinsic<T> }>;

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
    : T extends Interface ? DisambiguateObject<T, Model>
    : T;

type Interface = { [k: string]: any } & { [Symbol.toStringTag]?: never }

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
    [K in keyof T as {} extends { [P in K]: T[P]; } ? K : never]?: unknown
}