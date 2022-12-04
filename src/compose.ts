/*
    This file describes a functional composition mechanism called: compose.
    One of the simplest transformations.

*/

type Func<I,O> = (input: I) => O

const biCompose = <A,B,C>(f:Func<A,B>, g: Func<B,C>): Func<A,C> => {
        return (input: A) => g(f(input));
}

// All functions in the array should be of one type
export const compose = (...fns: Array<any>) => (...args: Array<any>) => fns.reduceRight((arg, fn)=>[fn(...arg)], args)[0];

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


//////////// compose with map functions
////////////  Increase all elements of the array by 10 and then multiply each one of them by 2
const numbers = [1,2,3,4,5,6]

/* Simply chain two map functions */
const result1 = numbers.map(num=>num+10).map(num=>num*2) 

/* compose two map functions with custom functional compose function */
const double = (num: number)=>num*2
const increaseBy10 = (num:number)=>num+10
const mapper = (fn: any) => (args:any[]) => args.map(element=>fn(element))
const result2 = compose(mapper(double), mapper(increaseBy10))(numbers)

/*
    compose(fn(fn1), fn(fn2)) ===  fn(compose(fn1, fn2)) 
    Associativity holds for composition function
*/
const result3 = mapper(compose(double, increaseBy10))(numbers)

console.log(result1, result2, result3)