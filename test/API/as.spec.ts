import { check, group, Context } from '../../src/index.js';
import { test, describe, expect } from 'vitest';

check.with(() => expect(true).toBe(true));

group.as(describe)('shared description', g => {
    const alice = { id: 1, name: 'Alice' as const };

    check(g('type-level check'), t => [
        t.equal(alice)<{ id: number, name: 'Alice' }>(),
        t.equal(t)<Context<'shared description ❱ type-level check'>>()
    ])

    test('runtime check', () => {
        expect(alice).toEqual({ id: 1, name: 'Alice' });
    });
    
    check.as(test)(g('type-level check reported as runtime check'), t => {
        return t.equal(alice)<{ id: number, name: 'Alice' }>();
    });

    check.as(test)(g('mixed runtime and type-level check'), t => {
        expect(alice).toEqual({ id: 1, name: 'Alice' });
        return t.equal(alice)<{ id: number, name: 'Alice' }>();
    });

    check.as(test, g)('hoised title accumulator', t => 
        t.equal(t)<Context<'shared description ❱ hoised title accumulator'>>()
    );

    group.as(describe, g)('nested group with hoisted title accumulator', g => {
        check.as(test, g)('nested type-level check', t => 
            t.equal(t)<Context<'shared description ❱ nested group with hoisted title accumulator ❱ nested type-level check'>>()
        );
    });
});