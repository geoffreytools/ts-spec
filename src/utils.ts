export { Fork, Eq, Or, Any, Never, Unknown, Extend, True, False , Either};

type Valid<T> = Not<Or<AnyOrUnknown<T>, Never<T>>>;
type AnyOrUnknown<T> = Eq<T, unknown>;

type Never<T> = Extend<T, never>;
type True<T> = And<Valid<T>, Extend<T, true>>;
type False<T> = And<Valid<T>, Extend<T, false>>;

type Either<A, B> = A extends false ? B : A;
type And<A, B> = Fork<A, Fork<B, B, false>, false>;
type Or<A, B> = Fork<A, A, Fork<B, B, false>>;
type Fork<P, T, F> = P extends false ? F : T;
type Not<T> = Extend<T, false>;

declare const thing: unique symbol;
type anything = typeof thing;

type Extend<A, B> = [A] extends [B] ? true : false;
type Any<T> = Extend<T | anything, T & anything>
type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false;

type Unknown<T> = unknown extends T ? Any<T> extends false ? true : false : false;