import { ArrayKeys, Eq, Extends as DoesExtend, IsAny as Any, IsUnknown as Unknown } from 'free-types-core/dist/utils';
import { apply} from 'free-types-core/dist/apply';
import { Unwrapped, unwrap } from 'free-types-core/dist/unwrap';
import { TypesMap } from 'free-types-core/dist/TypesMap';

// direct type-level API

export type { Equal, Extends, Includes }

interface OK { [result]: 'OK' }

interface FailEqual<A, B> { [result]: [A, B]}
interface FailExtend<A, B> { [result]: [A, B]}
interface FailInclude<A, B> { [result]: [A, B]}

type Equal<
    A extends R extends true ? unknown : never,
    B,
    R = Eq<Disambiguate<A>, Disambiguate<B>>
> = R extends true ? OK : FailEqual<A, B>;

type Extends<
    A extends R extends true ? unknown : never,
    B,
    R = Disambiguate<A> extends B ? true : false
> = R extends true ? OK : FailExtend<A, B>;

type Includes<
    A extends R extends true ? unknown : never,
    B,
    R = Disambiguate<B> extends A ? true : false
> = R extends true ? OK : FailInclude<A, B>;

// fully-featured API

export { test, debug, _, Context }

const test = <T extends CheckT, C = Context<T>, CheckT = Title<T>>
    (title: T, callback: (t: C) => PassingTest | PassingTest[]) => {}

const debug = (callback: (t: Context<any>) => PassingTest | PassingTest[]) => {}

const _ = null as unknown;

type Title<T> = Fork<DoesExtend<T, string>, ConstString<T>, string>;
type ConstString<T> = Fork<Eq<T, string>, { [missing]: 'as const' }, T>;
declare const missing: unique symbol;

type PassingTest = boolean | ((a: any) => boolean);

type Context<T> = {
    equal: {
        <A>(a?: A) : <B>(b?: B) => Equality<T, A, B, true>
        <A, B>(..._: [] | [A, B]) : Equality<T, A, B, true>
    },
    extends: {
        <A>(a?: A) : <B>(b?: B) => LeftEquality<T, A, B, true>
        <A, B>(..._: [] | [A, B]) : LeftEquality<T, A, B, true>
    },
    includes: {
        <A>(a?: A) : <B>(b?: B) => RightEquality<T, A, B, true>
        <A, B>(..._: [] | [A, B]) : RightEquality<T, A, B, true>
    },
    any: <A>(a?: A) => Test<T, A, any, true, Any<A>>,
    unknown: <A>(a?: A) => Test<T, A, unknown, true, Unknown<A>>,
    never: <A>(a?: A) => Test<T, A, never, true, Never<A>>,
    true: <A>(a?: A) => Test<T, A, true, true, True<A>>,
    false: <A>(a?: A) => Test<T, A, false, true, False<A>>
    not: {
        equal: {
            <A>(a?: A) : <B>(b?: B) => Equality<T, A, B, false>
            <A, B>(..._: [] | [A, B]) : Equality<T, A, B, false>
        },
        extends: {
            <A>(a?: A) : <B>(b?: B) => LeftEquality<T, A, B, false>
            <A, B>(..._: [] | [A, B]) : LeftEquality<T, A, B, false>
        },
        includes: {
            <A>(a?: A) : <B>(b?: B) => RightEquality<T, A, B, false>
            <A, B>(..._: [] | [A, B]) : RightEquality<T, A, B, false>
        },
        any: <A>(a?: A) => Test<T, A, any, false, Any<A>>,
        unknown:  <A>(a?: A) => Test<T, A, unknown, false, Unknown<A>>,
        never: <A>(a?: A) => Test<T, A, never, false, Never<A>>
        true: <A>(a?: A) => Test<T, A, true, false, True<A>>,
        false: <A>(a?: A) => Test<T, A, false, false, False<A>>
    }
}

type Equality<Title, A, B, T> =
    Test<Title, A, B, T, Eq<Disambiguate<A>, Disambiguate<B>>>

type LeftEquality<Title, A, B, T> =
    Test<Title, A, B, T, DoesExtend<Disambiguate<A>, B>>

type RightEquality<Title, A, B, T> =
    Test<Title, A, B, T, DoesExtend<Disambiguate<B>, A>>

type Test<Title, A, B, Success, R> =
    Either<Eq<R, Success>, Failure<Title, A, B>>

// Common

export type { _never, _any, _unknown, TypesMap }

declare const result: unique symbol;
type Failure<T, A, B> = Fork<Any<T>, Debug<A, B>, FailingTest<T, A, B>>
type FailingTest<T, A, B> = { title: T, a: A, b: B, [result]: 'fail' }
type Debug<A, B> = { a: A, b: B, [result]: 'fail' };
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

declare const _any: unique symbol;
declare const _never: unique symbol;
declare const _unknown: unique symbol;

type _any = typeof _any;
type _never = typeof _never;
type _unknown = typeof _unknown;

type Disambiguate<T> =
    Any<T> extends true ? _any
    : Never<T> extends true ? _never
    : {} extends T ? {}
    : Unknown<T> extends true ? _unknown
    : T extends unknown[]
    ? T extends [] | [unknown, ...unknown[]]
        ? DisambiguateTuple<T>
        : Disambiguate<T[0]>[]
    : T extends { [k: string | number | symbol]: unknown }
    ? { [K in keyof T]: Disambiguate<T[K]> }
    : T extends number | string | boolean | bigint ? DisambiguateBranded<T>
    : DisambiguateOther<T>

type DisambiguateTuple<T> = {
    [K in keyof T]: K extends ArrayKeys ? T[K] : Disambiguate<T[K]>
};

type DisambiguateOther<
    T,
    U extends Unwrapped = unwrap<T, TypesMap>,
> = [U] extends [never] ? T
    : apply<U['type'], DisambiguateTuple<U['args']>>;

type DisambiguateBranded<T, Tag = GetTag<T, Widen<T>>> = 
    Tag extends object ? GetRadical<T, Tag> & Disambiguate<Tag> : Tag

type Widen<T> =
    T extends number ? number
    : T extends string ? string
    : T extends boolean ? boolean
    : T extends bigint ? bigint
    : T;

type GetTag<T, U> = {[K in keyof T as K extends keyof U ? never : K]: T[K]}
type GetRadical<T, Tag> = T extends infer R & Tag ? R : never