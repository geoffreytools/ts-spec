# ts-spec

A small library for testing your types.

Features:
- Prevent false negatives and silent regressions;
- Organise you tests and declutter your namespace.
- Compare types and values with the same API;

## How to install
```
npm install --save-dev ts-spec
```

## How to use
Write your tests:
```typescript
import { test } from 'ts-spec';

test('test description', t => 
    t.equal ([1, 2, 3]) <string[]>()
);
```
See them fail in your IDE:

![IDE-inline](./IDE-inline.png)

![IDE-report](./IDE-report.png)

Or run them with `tsc`:
```
tests/your-test-file.ts:4:5 - error TS2322:

Type 'FailingTest<"test description", number[], string[]>'
is not assignable to type 'PassingTest'

t.equal ([1, 2, 3], <string[]>_)
        ~~~~~~~~~~~~~~~~~~~~~~~

Found 1 error.
```

## Limitation

The only way to expect a type error is with the directive `@ts-expect-error`.

Test descriptions must appear on the same line as the directive for them to show up in the report:

```typescript
// @ts-expect-error: `foo` does not accept strings
{ const test = foo('bar') }
```
```
tests/your-test-file.ts:3:1 - error TS2578: Unused '@ts-expect-error' directive.        

// @ts-expect-error: `foo` does not accept strings
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

> Note that they won't appear in VS Code's Problems view

The downside of expecting errors is that they can have other reasons to occur than the one stated in the description. For example, it could be that `foo` actually accepts strings but is not in scope.

# Documentation

[Writing tests](#writing-tests) | [Assertions](#assertions) | [Equality](#equality)

## Writing tests
### `test`

The function `test` is composed of a test description and a callback.

The callback can return one or multiple assertions, which can be wrapped in arbitrary ways in tuples, promises, functions or nested tests, enabling all kinds of patterns and test hierarchies.


#### Single assertion

```ts
test('test description', t =>
    t.pass()
);
```

#### Array of assertions

Implicitly returning a tuple of assertions conveniently reports failures where they occur:
```typescript
test('test description', t => [
    t.pass(),
    t.fail()
//  ~~~~~~~ pretty convenient
]);
```

Explicit returns enable sharing local variables, but they report failures at the callback level and print noisier error messages, unless you *`force`* type checking to happen sooner:

```typescript
test('test description', t => {
    const foo = 42;

    return t.force([
    //     ---------
        t.pass(),
        t.fail()
    //  ~~~~~~~ still good
    ])
});
```

#### Assertion returning functions
This pattern can be useful for testing type narrowing with only little boilerplate:
```typescript
test('`isArray` type guard narrows its input', t =>
    (input: number[] | number) =>
        Array.isArray(input)
        && t.equal(input)<number[]>()
);
```
It also makes unresolved generics accessible for testing:
```typescript
test('`Filter` returns useful type when input is generic', t =>
    <T extends (number | string)[]>() =>
        t.equal<Filter<T, number>, number[]>()
)
```

And of course it allows to scope variables:
```typescript
test('`bar` returns true', t => [
    () => {
        const foo = 42;
        return t.true(bar(foo))
    },
    () => {
        const foo = 2001;
        return t.true(bar(foo))
    }
]);
```

#### Nested tests

Tests can be nested in order to reduce repetition in test titles:

```typescript
test('Given Foo', t =>
// titles are accumulated by wrapping the current title with the parent `t`
    test(t('When Bar'), t => 
    //   -------------
        test(t('Then A'), t => t.fail()),
        //   -----------       ~~~~~~~~
        // 'FailingTest<"Given Foo ❱ When Bar ❱ Then A", never, true>'
        // is not assignable to type 'PassingTest'
    )
)
```
Nested tests are also a good option for sharing local variables because failures are reported by test leaves and don't bubble up:
```typescript
test('Given `foo` is 42', t => {
    const foo = 42;

    return [
        test(t('Something is true'), t =>
            t.true(bar(foo))
        ),

        test(t('Something else'), t =>
            t.fail()
        //  ~~~~~~~ still good
        )
    ]
});
```

## Assertions 

The library supports the following assertions
<table>
<tr>
<th align='center' width='130'>
<th align='center'>
<img width="195" height="1">

```ts
t.assertion()
```
</th>
<th align='center'>
<img width="195" height="1">

```ts
t.not.assertion()
```

</th>
<tr><td>equal A B
<td><ul><li>A and B are <a href="#equality">disambiguated</a><li>A and B extend each other
<td><ul><li>A and B are disambiguated<li>A and B do <strong>not</strong> extend each other

<tr><td>extends A B
<td><ul><li>A is disambiguated<li>A extends B
<td><ul><li>A is disambiguated<li>A does <strong>not</strong> extend B


<tr><td>includes A B
<td><ul><li>B is disambiguated<li>B extends A
<td><ul><li>B is disambiguated<li>B does <strong>not</strong> extend A


<tr><td>
any T
<td>&nbsp;&nbsp;&nbsp;T is strictly <code>any</code>
<td>&nbsp;&nbsp;&nbsp;T is strictly <strong>not</strong> <code>any</code>

<tr><td>unknown T
<td>&nbsp;&nbsp;&nbsp;T is strictly <code>unknown</code>
<td>&nbsp;&nbsp;&nbsp;T is strictly <strong>not</strong> <code>unknown</code>

<tr><td>never T
<td>&nbsp;&nbsp;&nbsp;T is strictly <code>never</code>
<td>&nbsp;&nbsp;&nbsp;T is strictly <strong>not</strong> <code>never</code>

<tr><td>true T
<td>&nbsp;&nbsp;&nbsp;T is strictly <code>true</code>
<td>&nbsp;&nbsp;&nbsp;T is strictly <strong>not</strong> <code>true</code>

<tr><td>false T
<td>&nbsp;&nbsp;&nbsp;T is strictly <code>false</code>
<td>&nbsp;&nbsp;&nbsp;T is strictly <strong>not</strong> <code>false</code>

</table>


They are made available as an argument in `test`'s callback.

![IDE-report](./IDE-callback.png)

They can be called in different ways depending on whether you test values (`a`) or types (`A`)\
and whether you prefer the placeholder or the curried syntax:

<table>
<tr>
<th align="center" width='190'>types only</th>
<th>
<img width="1" height="1">

```typescript
import { _ } from 'ts-spec'
```
</th>
<th align="center">curried syntax</th>
</tr>
<tr>
<td>

```typescript
t.equal<A, B>()
```

</td>
<td>

```typescript
t.equal(a, b)

t.equal(a, <B>_)

t.equal(<A>_, b)

t.equal(<A>_, <B>_)
```

</td>
<td>

```typescript
t.equal (a) (b)

t.equal (a) <B>()

t.equal <A>() (b)

t.equal <A>() <B>()
```

</td>
</tr>
</table>

### Custom assertions

You can leverage currying to create your own assertions:

```typescript
test('Bar and Baz are Foo', t => {
    const isFoo = t.equal<Foo>();
    return [
        isFoo<Bar>(),
        isFoo<Baz>()
    ];
})
```

If you want to share a custom assertion across tests, you must bring `Context` into scope and connect it like so:

```typescript
import { Context } from 'ts-spec';

const isFoo = <D>(t: Context<D>) => t.equal<Foo>();
```
Then, on the call site, apply the assertion with the context object before use:
```typescript
test('Bar is Foo', t =>
    isFoo(t)<Bar>()
)
```

## Equality

Tests can fail for 2 reasons:
- The condition of the assertion did not hold;
- `any`, `never` or `unknown` accidentally appeared in your type. 

A process of disambiguation converts `any`, `never` and `unknown` to unique symbols. The resulting behaviour is what you would expect from strict equality:

```typescript
test('`any` is equal to itself', t =>
    t.equal<{ foo: Set<any> }, { foo: Set<any> }>()
)

test('`any` is not equal to `number`', t =>
    t.equal<{ foo: Set<any> }, { foo: Set<number> }>()
//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FailingTest
)

```

### Asymmetric equality

Assertions are set up with the assumption that the type under test should always be the narrowest of the two operands, the other one is thus not disambiguated in order to enable loose tests to be written:

```typescript
test('It is possible to extend `any`', t => [
    t.extends<number[], any[]>()
    t.includes<any[], number[]>()
])

test('But the reverse is likely a mistake', t => [
    t.extends<any[], number[]>()
//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FailingTest
    t.includes<number[], any[]>()
//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FailingTest
])
```
You can refer to the [assertions table](#assertions) for a synthetic view of the differences between assertions.

#### Placeholders
If you want the type under test to include `any`, `never` or `unknown` in an asymmetric assertion, you can import the placeholders `_any`, `_never` and `_unknown`:

```typescript
import { _never } from 'ts-spec'

test('use `_never` to extend `never`', t => [
    t.extends<[1, 2, never], [number, number, _never]>(),
])
```

### User classes
Disambiguation works out of the box for arbitrarily nested built-in types. However, user classes need to be registered for them to be disambiguated:
```typescript
import { test } from 'ts-spec'
import { Type, A } from 'free-types'

// The class we want to test
class Foo<T extends number> {
    constructor(private value: T) { ... }
}

// A free type constructor for that class
interface $Foo extends Type<[number]> { type: Foo<A<this>> }

// which we register into ts-spec.TypesMap
declare module 'ts-spec' {
    interface TypesMap { Foo: $Foo }
}

// Now we are safe
test('Registered user classes are disambiguated', t =>
    t.equal<Foo<any>, Foo<number>>()
//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FailingTest
)
```

> The `TypesMap` repository is shared with the `free-types` library, which means `declare module 'free-types'` would also work.

See the [free-types](https://github.com/geoffreytools/free-types) documentation for more information about free type constructors.