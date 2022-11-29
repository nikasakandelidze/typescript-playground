/*
    This file describes a functional composition mechanism called: compose.
    One of the simplest transformations.

*/

type Func<I,O> = (input: I) => O

const compose = <A,B,C>(f:Func<A,B>, g: Func<B,C>): Func<A,C> => {
        return (input: A) => g(f(input));
}

// Test above composition code
const add = (a:number) => (b:number) => a + b
const addTwo = add(2);
const substractTwo = add(-2);

const identity = compose(addTwo, substractTwo);
const addFour = compose(addTwo, addTwo);

console.log(addFour(3)) //should print 7
console.log(identity(3)) //should print 3