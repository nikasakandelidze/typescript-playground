/*
    This file describes a functional composition mechanism called: compose.
    One of the simplest transformations.

*/

type Func<I,O> = (input: I) => O

const biCompose = <A,B,C>(f:Func<A,B>, g: Func<B,C>): Func<A,C> => {
        return (input: A) => g(f(input));
}


const compose = (...fns: Array<any>) => (...args: Array<any>) => fns.reduceRight((arg, fn)=>[fn(...arg)], args)[0];

// Test above composition code
const add = (a:number) => (b:number) => a + b
const addOne = add(1)
const addTwo = add(2);
const substractTwo = add(-2);

const identity = biCompose(addTwo, substractTwo);
const addFour = biCompose(addTwo, addTwo);

console.log(addFour(3)) //should print 7
console.log(identity(3)) //should print 3


const identity2 = compose(addTwo, substractTwo)
const addSomething = compose(addTwo, addTwo, addOne, addOne)
console.log(identity2(10))
console.log(addSomething(10))