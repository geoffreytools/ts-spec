import { test } from '../src'

// Comparing equality algorithms on edge cases
// https://github.com/microsoft/TypeScript/issues/27024
// t.equal fails to exclude `any` on unknown user classes

type Equal1<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? true : false;

type _Equal2<T> = T extends infer R & {}
    ? { [P in keyof R]: R[P] } : never

type Equal2<A, B> = (<T>() => T extends _Equal2<A> ? 1 : 2) extends
    (<T>() => T extends _Equal2<B> ? 1 : 2) ? true : false

type Equal3<X, Y> = [X, Y] extends [Y, X] ? true: false;

type Equal4<T, S> =
  [T] extends [S] ? ([S] extends [T] ? true : false) : false

type And<X,Y> = X extends true ? Y extends true ? true : false : false
type IsAny<T> = 0 extends (1 & T) ? true : false

type _Equal5<X,Y> = (X extends Y ? 1 : 2) extends (Y extends X ? 1 : 3) ? true : false
type _Equal5Tuple<X,Y,Z> = X extends [any] ? Y extends [any] ? Equal5<X[number], Y[number]> : false : Z
type Equal5<X,Y> = _Equal5Tuple<X,Y, And<_Equal5<IsAny<X>, IsAny<Y>>, _Equal5<X,Y>>>

type Equal6<A, B> = _HalfEqual6<A, B> extends true ? _HalfEqual6<B, A> : false;

type _HalfEqual6<A, B> = (
    A extends unknown
        ? (
              B extends unknown
                  ? A extends B
                      ? B extends A
                          ? keyof A extends keyof B
                              ? keyof B extends keyof A
                                  ? A extends object
                                      ? _DeepHalfEqual6<A, B, keyof A> extends true
                                          ? 1
                                          : never
                                      : 1
                                  : never
                              : never
                          : never
                      : never
                  : unknown
          ) extends never
            ? 0
            : never
        : unknown
) extends never
    ? true
    : false;

type _DeepHalfEqual6<A, B extends A, K extends keyof A> = (
    K extends unknown ? (Equal6<A[K], B[K]> extends true ? never : 0) : unknown
) extends never
    ? true
    : false;

class Hidden { }

type Equal7<T, S> =
    [T] extends [S] ?
    [S] extends [T] ?
    [Hidden] extends [T] ?
    [Hidden] extends [S] ? true : 
    false :                       
    [Hidden] extends [S] ? false :
    true :                        
    false :                       
    false                         

type A1 = { x: 1 } & { y: 2 }
type A2 = { y: 2 } & { x: 1 }
type A3 = { x: 1, y: 2 }

type B1 = 1 | number & {};
type B2 = number;

type C1 = [any, number];
type C2 = [number, any]

type D1 = { x: any }
type D2 = { x: 1 }

type E1 = Foo<number>;
type E2 = Foo<any>;
class Foo<T> {
    constructor(private foo: T) {}
}

type F1 = number & { _tag: 'dollar' };
type F2 = number & { _tag: any };


test('Intersection', t => [
    // ts-spec/equal
    t.equal<A1, A3>(),
    // @ts-expect-error: Equal1
    t.true<Equal1<A1, A3>>(),
    // Equal2
    t.true<Equal2<A1, A3>>(),
    // Equal3
    t.true<Equal3<A1, A3>>(),
    // Equal4
    t.true<Equal4<A1, A3>>(),
    // Equal5
    t.true<Equal5<A1, A3>>(),
    // Equal6
    t.true<Equal6<A1, A3>>(),
    // Equal7
    t.true<Equal7<A1, A3>>(),
])

test('Union', t => [
    // ts-spec/equal
    t.equal<A1 | A2, A2>(),
    // @ts-expect-error: Equal1
    t.true<Equal1<A1 | A2, A2>>(),
    // @ts-expect-error: Equal2
    t.true<Equal2<A1 | A2, A2>>(),
    // Equal3
    t.true<Equal3<A1 | A2, A2>>(),
    // Equal4
    t.true<Equal4<A1 | A2, A2>>(),
    // Equal5
    t.true<Equal5<A1 | A2, A2>>(),
    // Equal6
    t.true<Equal6<A1 | A2, A2>>(),
    // Equal7
    t.true<Equal7<A1 | A2, A2>>(),
])

test('Union + intersection', t => [
    // ts-spec/equal
    t.equal<B1, B2>(),
    // @ts-expect-error: Equal1
    t.true<Equal1<B1, B2>>(),
    // Equal2
    t.true<Equal2<B1, B2>>(),
    // Equal3
    t.true<Equal3<B1, B2>>(),
    // Equal4
    t.true<Equal4<B1, B2>>(),
    // Equal5
    t.true<Equal5<B1, B2>>(),
    // @ts-expect-error: Equal6
    t.true<Equal6<B1, B2>>(),
    // Equal7
    t.true<Equal7<B1, B2>>(),
])

test('exclude `any` fliped pairs', t => [
    // ts-spec/equal
    t.not.equal<C1, C2>(),
    // Equal1
    t.false<Equal1<C1, C2>>(),
    // Equal2
    t.false<Equal2<C1, C2>>(),
    // @ts-expect-error: Equal3
    t.false<Equal3<C1, C2>>(),
    // @ts-expect-error: Equal4
    t.false<Equal4<C1, C2>>(),
    // @ts-expect-error: Equal5
    t.false<Equal5<C1, C2>>(),
    // @ts-expect-error: Equal6 (type instantiation problem)
    t.false<Equal6<C1, C2>>(),
    // @ts-expect-error: Equal7
    t.false<Equal7<C1, C2>>(),
])

test('exclude `any` single key obj', t => [
    // ts-spec/equal
    t.not.equal<D1, D2>(),
    // Equal1
    t.false<Equal1<D1, D2>>(),
    // Equal2
    t.false<Equal2<D1, D2>>(),
    // @ts-expect-error: Equal3
    t.false<Equal3<D1, D2>>(),
    // @ts-expect-error: Equal4
    t.false<Equal4<D1, D2>>(),
    // @ts-expect-error: Equal5
    t.false<Equal5<D1, D2>>(),
    // Equal6
    t.false<Equal6<D1, D2>>(),
    // @ts-expect-error: Equal7
    t.false<Equal7<D1, D2>>(),
])

test('exclude `any` unknown user class', t => [
    // @ts-expect-error: ts-spec/equal
    t.not.equal<E1, E2>(),
    // Equal1
    t.false<Equal1<E1, E2>>(),
    // @ts-expect-error: Equal2
    t.false<Equal2<E1, E2>>(),
    // @ts-expect-error: Equal3
    t.false<Equal3<E1, E2>>(),
    // @ts-expect-error: Equal4
    t.false<Equal4<E1, E2>>(),
    // @ts-expect-error: Equal5
    t.false<Equal5<E1, E2>>(),
    // @ts-expect-error: Equal6
    t.false<Equal6<E1, E2>>(),
    // @ts-expect-error: Equal7
    t.false<Equal7<E1, E2>>(),
])

test('branded types', t => [
    // ts-spec/equal
    t.not.equal<F1, F2>(),
    // Equal1
    t.false<Equal1<F1, F2>>(),
    // Equal2
    t.false<Equal2<F1, F2>>(),
    // @ts-expect-error: Equal3
    t.false<Equal3<F1, F2>>(),
    // @ts-expect-error: Equal4
    t.false<Equal4<F1, F2>>(),
    // @ts-expect-error: Equal5
    t.false<Equal5<F1, F2>>(),
    // Equal6
    t.false<Equal6<F1, F2>>(),
    // @ts-expect-error: Equal7
    t.false<Equal7<F1, F2>>(),
])