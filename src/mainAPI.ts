import { apply, Type, A } from 'free-types-core';

import { Eq, Fork, Extend, True, False, Any, Unknown, Never, Either } from './utils'

import {
    Disambiguate,
    StrictReadonly,
    Failure,
    FailingTest,
    Debug,
} from './Equality'

export { test, _, Context }

const test = <
    T extends string & CheckTitle,
    R extends PassingTest,
    C = Context<T>,
    CheckTitle = Title<T>,
> (title: T, callback: (t: C) => R ) =>
    null as any as R;

const _ = null as unknown;

type Title<T> = Fork<Extend<T, string>, ConstString<T>, string>;
type ConstString<T> = Fork<Eq<T, string>, { [missing]: 'as const' }, T>;
declare const missing: unique symbol;

type PassingTest =
    | Passing
    | ((a: any) => PassingTest)
    | readonly PassingTest[]
    | Promise<PassingTest>

type Passing = true;

type BinaryTest<T extends string, $F extends $BinaryAssertion> = {
    <A>(...a: [A] | []): <B>(...b: [B] | []) => apply<$F, [T, A, B]>
    <A, B>(..._: [] | [A, B]): apply<$F, [T, A, B]>
}

type Context<T extends string> = (<U extends string>(title: U) => `${T} ❱ ${U}`) & {
    pass: () => true
    fail: () => Test<T, never, true, true, True<never>>
    equal: BinaryTest<T, $Equals<true>>,
    extends: BinaryTest<T, $Extends<true>>,
    includes: BinaryTest<T, $Includes<true>>,
    any: <A>(a?: A) => Test<T, A, any, true, Any<A>>,
    unknown: <A>(a?: A) => Test<T, A, unknown, true, Unknown<A>>,
    never: <A>(a?: A) => Test<T, A, never, true, Never<A>>,
    true: <A>(a?: A) => Test<T, A, true, true, True<A>>,
    false: <A>(a?: A) => Test<T, A, false, true, False<A>>
    not: {
        equal: BinaryTest<T, $Equals<false>>,
        extends: BinaryTest<T, $Extends<false>>,
        includes: BinaryTest<T, $Includes<false>>,
        any: <A>(a?: A) => Test<T, A, any, false, Any<A>>,
        unknown:  <A>(a?: A) => Test<T, A, unknown, false, Unknown<A>>,
        never: <A>(a?: A) => Test<T, A, never, false, Never<A>>
        true: <A>(a?: A) => Test<T, A, true, false, True<A>>,
        false: <A>(a?: A) => Test<T, A, false, false, False<A>>
    }
}

interface $BinaryAssertion extends
    Type<[string, unknown, unknown], Passing | FailingTest | Debug>
        { Title: A<this>, A: this[1], B: this[2] }

interface $Equals<Accept extends boolean> extends $BinaryAssertion {
    type: Test<this['Title'], this['A'], this['B'], Accept,
        Eq<Disambiguate<this['A'], this['B']>, Disambiguate<this['B'], this['A']>>>
}

interface $Extends<Accept extends boolean> extends $BinaryAssertion {
    type: Test<this['Title'], this['A'], this['B'], Accept,
        Extend<Disambiguate<this['A'], this['B']>, StrictReadonly<this['B']>>>
}

interface $Includes<Accept extends boolean> extends $BinaryAssertion {
    type: Test<this['Title'], this['A'], this['B'], Accept,
        Extend<Disambiguate<this['B'], this['A']>, StrictReadonly<this['A']>>>
}

type Test<Title extends string, A, B, Accept, R> =
    Either<Eq<R, Accept>, Failure<Title, A, B>>
