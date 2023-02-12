import { test, _ } from '../src'

test('type / type' as const, t => [
    t.equal<1, 1>(),
    t.not.equal<2, 1>()
])

test('type / type curry' as const, t => [
    t.equal<1>() <1>(),
    t.not.equal<2>() <1>()
])

test('type / value curry' as const, t =>[
    t.equal<1>()(1 as const),
    t.not.equal<2>()(1 as const)
])

test('type / value curry placeholder' as const, t =>[
    t.equal(<1>_)(1 as const),
    t.not.equal(<2>_)(1 as const)
])

test('type / value placeholder' as const, t =>[
    t.equal(<1>_, 1 as const),
    t.not.equal(<2>_, 1 as const)
])

test('value / type curry' as const, t =>[
    t.equal(1 as const)<1>(),
    t.not.equal(2 as const)<1>()
])

test('value / type curry placeholder' as const, t =>[
    t.equal(1 as const)(<1>_),
    t.not.equal(2 as const)(<1>_)
])

test('value / type placeholder' as const, t =>[
    t.equal(1 as const, <1>_),
    t.not.equal(2 as const, <1>_)
])

test('value / value curry' as const, t =>[
    t.equal(1 as const)(1 as const),
    t.not.equal(2 as const)(1 as const)
])

test('value / value' as const, t =>[
    t.equal(1 as const, 1 as const),
    t.not.equal(2 as const, 1 as const)
])

test('unary test value' as const, t => [
    t.false(false as const),
    t.true(true as const),
    t.any(null as any),
    t.never(null as never),
    t.unknown(null as unknown),
    t.not.false(null),
    t.not.true(null),
    t.not.any(null),
    t.not.never(null),
    t.not.unknown(null),
])

test('unary test type' as const, t => [
    t.false<false>(),
    t.true<true>(),
    t.any<any>(),
    t.never<never>(),
    t.unknown<unknown>(),
    t.not.false<null>(),
    t.not.true<null>(),
    t.not.any<null>(),
    t.not.never<null>(),
    t.not.unknown<null>(),
])

test('unary test type placeholder' as const, t => [
    t.false(<false>_),
    t.true(<true>_),
    t.any(<any>_),
    t.never(<never>_),
    t.unknown(<unknown>_),
    t.not.false(<null>_),
    t.not.true(<null>_),
    t.not.any(<null>_),
    t.not.never(<null>_),
    t.not.unknown(<null>_)
])