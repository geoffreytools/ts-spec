import { ArrayKeys, Eq, Extends, IsAny as Any, IsUnknown as Unknown } from 'free-types-core/dist/utils';
import { apply} from 'free-types-core/dist/apply';
import { Unwrapped, unwrap } from 'free-types-core/dist/unwrap';
import { TypesMap } from 'free-types-core/dist/TypesMap';


export { test, debug, _ }

const test = <T extends CheckT, C = Context<T>, CheckT = Title<T>>
    (title: T, callback: (t: C) => PassingTest | PassingTest[]) => {}

const debug = (callback: (t: Context<any>) => PassingTest | PassingTest[]) => {}

const _ = null as unknown;

export type { Context, _never, _any, _unknown, TypesMap }

type Title<T> = Fork<Extends<T, string>, ConstString<T>, string>;
type ConstString<T> = Fork<Eq<T, string>, { [missing]: 'as const' }, T>;
declare const missing: unique symbol;

type PassingTest = boolean | ((a: any) => boolean);

type Context<T> = {
    equal: Equal<T>,
    extends: SubType<T>,
    includes: SuperType<T>,
    any: IsAny<T>,
    unknown: IsUnknown<T>,
    never: IsNever<T>,
    true: IsTrue<T>,
    false: IsFalse<T>
    not: {
        equal: NotEqual<T>,
        extends: NotSubType<T>,
        includes: NotSuperType<T>,
        any: IsNotAny<T>,
        unknown: IsNotUnknown<T>,
        never: IsNotNever<T>
        true: IsNotTrue<T>,
        false: IsNotFalse<T>
    }
}

type Equal<T> = {
    <A>(a?: A) : <B>(b?: B) => Equality<T, A, B, true>
    <A, B>(..._: [] | [A, B]) : Equality<T, A, B, true>
}

type SubType<T> = {
    <A>(a?: A) : <B>(b?: B) => LeftEquality<T, A, B, true>
    <A, B>(..._: [] | [A, B]) : LeftEquality<T, A, B, true>
}

type SuperType<T> = {
    <A>(a?: A) : <B>(b?: B) => RightEquality<T, A, B, true>
    <A, B>(..._: [] | [A, B]) : RightEquality<T, A, B, true>
}
type NotEqual<T> = {
    <A>(a?: A) : <B>(b?: B) => Equality<T, A, B, false>
    <A, B>(..._: [] | [A, B]) : Equality<T, A, B, false>
}
type NotSubType<T> = {
    <A>(a?: A) : <B>(b?: B) => LeftEquality<T, A, B, false>
    <A, B>(..._: [] | [A, B]) : LeftEquality<T, A, B, false>
}
type NotSuperType<T> = {
    <A>(a?: A) : <B>(b?: B) => RightEquality<T, A, B, false>
    <A, B>(..._: [] | [A, B]) : RightEquality<T, A, B, false>
}

type IsTrue<Title> = <A>(a?: A) => Test<Title, A, true, true, True<A>>
type IsNotTrue<Title> = <A>(a?: A) => Test<Title, A, true, false, True<A>>
type IsFalse<Title> = <A>(a?: A) => Test<Title, A, false, true, False<A>>
type IsNotFalse<Title> = <A>(a?: A) => Test<Title, A, false, false, False<A>>
type IsNever<Title> = <A>(a?: A) => Test<Title, A, never, true, Never<A>>
type IsUnknown<Title> = <A>(a?: A) => Test<Title, A, unknown, true, Unknown<A>>
type IsAny<Title> = <A>(a?: A) => Test<Title, A, any, true, Any<A>>
type IsNotNever<Title> = <A>(a?: A) => Test<Title, A, never, false, Never<A>>
type IsNotUnknown<Title> = <A>(a?: A) => Test<Title, A, unknown, false, Unknown<A>>
type IsNotAny<Title> = <A>(a?: A) => Test<Title, A, any, false, Any<A>>

type Equality<Title, A, B, T> =
    Test<Title, A, B, T, Eq<Disambiguate<A>, Disambiguate<B>>>

type LeftEquality<Title, A, B, T> =
    Test<Title, A, B, T, Extends<Disambiguate<A>, B>>

type RightEquality<Title, A, B, T> =
    Test<Title, A, B, T, Extends<Disambiguate<B>, A>>

type Test<Title, A, B, Success, R> =
    Either<Eq<R, Success>, Failure<Title, A, B>>

declare const result: unique symbol;
type Failure<T, A, B> = Fork<Any<T>, Debug<A, B>, FailingTest<T, A, B>>
type FailingTest<T, A, B> = { title: T, a: A, b: B, [result]: 'fail' }
type Debug<A, B> = { a: A, b: B, [result]: 'fail' };
type Valid<T> = Not<Or<AnyOrUnknown<T>, Never<T>>>;
type AnyOrUnknown<T> = Eq<T, unknown>;

type Never<T> = Extends<T, never>;
type True<T> = And<Valid<T>, Extends<T, true>>;
type False<T> = And<Valid<T>, Extends<T, false>>;

type Either<A, B> = A extends false ? B : A;
type And<A, B> = Fork<A, Fork<B, B, false>, false>;
type Or<A, B> = Fork<A, A, Fork<B, B, false>>;
type Fork<P, T, F> = P extends false ? F : T;
type Not<T> = Extends<T, false>;

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