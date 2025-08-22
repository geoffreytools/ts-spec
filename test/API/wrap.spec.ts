import { check, group, Context } from '../../src/index.js';
import { test, describe } from 'vitest';


group.as(describe)('given a user service', g => {
    const service = { createUser: <T extends string>(name: T) => ({ id: 1 as const, name }) };

    test('creates user correctly', ({ expect }) => {
        expect(service.createUser('Alice')).toEqual({ id: 1, name: 'Alice' });
    });
    
    check(g('user has correct type'), t => [
        t.equal(service.createUser('Alice'))<{ id: 1, name: 'Alice' }>(),
        t.equal(t)<Context<'given a user service ❱ user has correct type'>>()
    ])
});
