import { test, _never } from '../src'
import { Type } from 'free-types-core';

test('disambiguate raw type', t => [
    t.not.equal<number, any>(),
    t.not.equal<number, unknown>(),
    t.not.equal<number, never>(),
])

test('any, never and unknown are distinct types', t => [
    t.not.equal<never, any>(),
    t.not.equal<never, unknown>(),
    t.not.equal<any, unknown>(),
])

test('disambiguate built-in basic types', t => [
    t.not.equal<number[], any[]>(),
    t.not.equal<[number], [any]>(),
    t.not.equal<[number, ...number[]], [number, ...any[]]>(),
    t.not.equal<{ foo: number }, { foo: any }>(),
    t.not.equal<{ foo: number }[], { foo: any }[]>(),
    t.not.equal<[{ foo: number }], [{ foo: any }]>(),
    t.extends<[number],  readonly [any]>(),
    t.extends<number[],  readonly any[]>(),
    t.includes<readonly [any],  [number]>(),
    t.includes<readonly any[], number[]>(),
    t.not.includes<[any],  readonly [number]>(),
    t.not.includes<any[],  readonly number[]>(),
    t.not.extends<readonly [number],  [any]>(),
    t.not.extends<readonly number[], any[]>(),
])

test('disambiguate tuples with optional members', t => [
    t.not.equal<[number?], (number | undefined)[]>(),
    t.not.equal<[number?, number?], (number | undefined)[]>(),
    t.not.equal<[number?], [any?]>(),
    t.not.equal<[number?, number?], [number?, any?]>()
])

test('disambiguate built-in class', t => [
    t.not.equal<Set<number>, Set<any>>(),
    t.not.equal<{ foo: Set<any> }, { foo: Set<unknown> }>(),
])

class Test<T> { constructor(private value: T) {} }
interface $Test extends Type<1> { type: Test<this[0]> }
declare module '../src' { interface TypesMap { Test: $Test } }

test('disambiguate known user class', t => [
    t.not.equal<Test<number>, Test<any>>(),
    t.not.equal<{ foo: Test<number> }, { foo: Test<any> }>()
])

test('disambiguation preserves true equality', t => [
    t.equal<[1, 2, any], [1, 2, any]>(),
    t.equal<[1, 2, never], [1, 2, never]>(),
    t.equal<[1, 2, unknown], [1, 2, unknown]>(),
])

test('`any` spreads to an array', t => 
    t.equal<[...any], [...any[]]>()
)