import { test, Context } from '../../src';

/** Title concatenation */

// Nesting of single passing assertion
test('given foo', t =>
    test(t('then A'), t =>
        t.equal(t)<Context<'given foo ❱ then A'>>()
    )
)

// Nesting of array of passing assertions
test('given foo', t => [
    test(t('then A'), t =>
        t.equal(t)<Context<'given foo ❱ then A'>>()
    ),
    test(t('then B'), t =>
        t.equal(t)<Context<'given foo ❱ then B'>>()
    ),
])

// Nesting of nested passing assertions
test('given foo', t =>
    test(t('when bar'), t =>
        test(t('then A'), t =>
            t.equal(t)<Context<'given foo ❱ when bar ❱ then A'>>)
    )
)


// nesting of array of nested array of assertions
test('given foo', t => [
    test(t('when baz'), t => [
        test(t('then A'), t => t.pass()),
        test(t('then B'), t =>
            t.equal(t)<Context<'given foo ❱ when baz ❱ then B'>>()
        )
    ])
])


/** Arbitrary nestings */

// nesting of single passing assertion
test('given foo', t =>
    test('then A', t => t.pass())
)

// nesting of single failing assertions
test('given foo', t =>
    // @ts-expect-error: failing assertion
    test('then A', t => t.fail())
)

// nesting of nested single passing assertion
test('given foo', t =>
    test('when bar', t => 
        test('then A', t => t.pass())
    )
)

// nesting of nested single failing assertion
test('given foo', t =>
    test('when bar', t =>
        // @ts-expect-error: failing assertion
        test('then A', t => t.fail())
    )
)

// nesting of array of passing assertions
test('given foo', t => [
    test('then A', t => t.pass()),
    test('then A', t => t.pass())
])

// nesting of array of failing assertions
test('given foo', t => [
    test('then A', t => t.pass()),
    // @ts-expect-error: failing assertion
    test('then B', t => t.fail())
])

// nesting of array of nested single passing assertions
test('given foo', t => [
    test('when bar', t => 
        test('then A', t => t.pass())
    ), 
    test('when baz', t => 
        test('then A', t => t.pass())
    )
])

// nesting of array of nested single failing assertions
test('given foo', t => [
    test('when bar', t => 
        test('then A', t => t.pass())
    ), 
    test('when baz', t => 
    // @ts-expect-error: failing assertion
        test('then A', t => t.fail())
    )
])

// nesting of array of nested array of passing assertions
test('given foo', t => [
    test('when bar', t => [
        test('then A', t => t.pass()),
        test('then B', t => t.pass()),
    ]), 
    test('when baz', t => [
        test('then A', t => t.pass()),
        test('then B', t => t.pass()),
    ])
])

// nesting of array of nested array of failing assertions
test('given foo', t => [
    test('when bar', t => [
        test('then A', t => t.pass()),
        // @ts-expect-error: failing assertion
        test('then B', t => t.fail()),
    ]), 
    test('when baz', t => [
        test('then A', t => t.pass()),
        // @ts-expect-error: failing assertion
        test('then B', t => t.fail()),
    ])
])


/** Error contamination */

test('A', t => [
    test(t('B'), t => [
        test(t('C'), t => [
            t.pass(),
            // @ts-expect-error: local to this assertion
            t.fail()
        ])
    ])
])

test('A', t => [
    test(t('B'), t => [
        test(t('C'), t => [
            t.pass(),
            t.pass()
        ]),
        // @ts-expect-error: local to this assertion
        t.fail()
    ])
])