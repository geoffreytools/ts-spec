import { test, _ } from '../src'

test('includes disambiguates B' as const, t => [
    // @ts-expect-error: Failing test
    t.includes<[1, 2, 3], [1, 2, any]>(),
    // @ts-expect-error: Failing test
    t.includes<[1, 2, 3], [1, 2, never]>(),
    t.not.includes<[1, 2, 3], [1, 2, any]>(),
    t.not.includes<[1, 2, 3], [1, 2, never]>(),
])

test('includes does not disambiguate A' as const, t => [
    t.includes<[1, 2, unknown], [1, 2, 3]>(),
    t.includes<[1, 2, any], [1, 2, 3]>(),
])
