import { check, group, Context } from '../../src/index.js';
import { test, describe, expect } from 'vitest';

group.as(describe)('given a user service', g => {
    const service = { createUser: <T extends string>(name: T) => ({ id: 1 as const, name }) };

    test('creates user correctly', () => {
        expect(service.createUser('Alice')).toEqual({ id: 1, name: 'Alice' });
    });
    
    check(g('user has correct type'), t => [
        t.equal(service.createUser('Alice'))<{ id: 1, name: 'Alice' }>(),
        t.equal(t)<Context<'given a user service ❱ user has correct type'>>()
    ])
});

describe('check.as() functionality', () => {
    check.as(test)('should work with vitest test function', t => {
        expect(true).toBe(true);

        return t.equal<number, number>();
    });
});

group.as(describe)('given a user service', g => {
    const service = { createUser: (name: string) => ({ id: 1, name }) };

    check.as(test)(g('creates user correctly'), t => {
        expect(service.createUser('Alice')).toEqual({ id: 1, name: 'Alice' });
        return t.equal(service.createUser('Alice'))<{ id: number, name: string }>();
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