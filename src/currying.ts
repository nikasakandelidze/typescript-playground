
export namespace CURRYING {
    /* 
        Currying is the transformation of a function with multiple arguments into a sequence of single-argument functions. 
        That means converting a function like this f(a, b, c, ...) into a function like this f(a)(b)(c)... .

        Currying can be real virtue in case of creating specialized functions.
        What's demonstrated here is the ability to "pre-load" a function with an argument or two in order to receive a new function that remembers those arguments.
    
        When we spoke about pure functions, we said they take 1 input to 1 output. Currying does exactly this: each single argument returns a new function expecting the remaining arguments. That, old sport, is 1 input to 1 output.

        Currying in some cases will help you avoid code duplication in context of calling one and the same function with multiple arguments(some of them different) several times.
    */

    type CurryFunction = (...args: Array<any>) => any

    /*
        Idea is to create a wrapper function of "curry" that will wrap some regular functions and
        on each separate 1 argument invocation will return new function that let's user invoke with the rest of arguments till the limit of arg is reached.
    */
    export const curry = (func: CurryFunction):any => {
        const arity: number = func.length
        return function $curry(...args: Array<any>):any {
            if(args.length >= arity){
                return func(...args)
            }
            return (...rest: Array<any>)=>$curry(...args, ...rest)
        }
    }
}


const addTwoNumbers = (a:number, b:number)=>a+b

const curryAddition = CURRYING.curry(addTwoNumbers)
const result = curryAddition(1)(2)
console.log(result)
 
// Custom, specialized adder
const incrementer = curryAddition(1)
const decrementer = curryAddition(-1)

console.log(incrementer(10))
console.log(decrementer(10))

// Custom, specialized mappers
const mapper = (transformer: (input: any)=>any, array:Array<any>)=> array.map(transformer)
const curryMapper = CURRYING.curry(mapper) //This can help you tranform any function that works on individual data points to wokr on lists of data

const doubler=curryMapper((input:any)=>input*2)
const doublerResult1:Array<number> = doubler([1,2,3,11,12,13])
const doublerResult2:Array<number> = doubler([0,-1,1,2])
console.log(doublerResult1)
console.log(doublerResult2)

/*
 *  My thought is that currying is really helpful when trying to use different functions with different input arguments within one compose pipeline, 
 *  since it lets pipeline API be uniform.
 */