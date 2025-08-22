import { test, group, Context } from '../../src/index.js';

/** Title concatenation with group */

// Group with single test
group('given setup', g => {
    test(g('when condition'), t => 
        t.equal(t)<Context<'given setup ❱ when condition'>>()
    );
})

// Group with multiple tests (using statement form)
group('given setup', g => {
    test(g('when condition A'), t => 
        t.equal(t)<Context<'given setup ❱ when condition A'>>()
    );

    test(g('when condition B'), t => 
        t.equal(t)<Context<'given setup ❱ when condition B'>>()
    );
})

// Nested groups
group('given setup', g => {
    group(g('when state'), g => {
        test(g('then outcome'), t => 
            t.equal(t)<Context<'given setup ❱ when state ❱ then outcome'>>()
        );
    });
})

// Group with nested tests  
group('given setup', g => {
    group(g('when scenario A'), g => {
        test(g('then result 1'), t => t.pass());
        test(g('then result 2'), t => 
            t.equal(t)<Context<'given setup ❱ when scenario A ❱ then result 2'>>()
        );
    });
    group(g('when scenario B'), g => {
        test(g('then result 1'), t => t.pass());
        test(g('then result 2'), t => 
            t.equal(t)<Context<'given setup ❱ when scenario B ❱ then result 2'>>()
        );
    });
})

/** Mixed group and test nesting */

// Group containing regular tests with arbitrary titles
group('given setup', g => {
    test('when direct test', t => t.pass());
    test(g('when group test'), t => 
        t.equal(t)<Context<'given setup ❱ when group test'>>()
    );
})

// Test containing groups (using array form for test, statement form for group)
test('given context', t => [
    group(t('when grouped'), g => {
        test(g('then result'), t => 
            t.equal(t)<Context<'given context ❱ when grouped ❱ then result'>>()
        );
    }),
    test(t('when direct'), t => 
        t.equal(t)<Context<'given context ❱ when direct'>>()
    )
])

// Complex nesting with groups and tests
test('given root', t => [
    group(t('when group A'), g => {
        test(g('then test 1'), t => t.pass());
        group(g('when nested group'), g => {
            test(g('then nested test'), t => 
                t.equal(t)<Context<'given root ❱ when group A ❱ when nested group ❱ then nested test'>>()
            );
        });
    }),
    test(t('when direct test'), t => 
        t.equal(t)<Context<'given root ❱ when direct test'>>()
    )
])

/** Group with failing tests */

// Group with single failing test
group('given setup', g => {
    // @ts-expect-error: failing assertion
    test(g('when condition'), t => t.fail());
})

// Group with mixed passing and failing tests
group('given setup', g => {
    test(g('when passing'), t => t.pass());
    // @ts-expect-error: failing assertion
    test(g('when failing'), t => t.fail());
})

// Nested groups with failures
group('given setup', g => {
    group(g('when state'), g => {
        test(g('then success'), t => t.pass());
        // @ts-expect-error: failing assertion
        test(g('then failure'), t => t.fail());
    });
})