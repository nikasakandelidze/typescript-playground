// I am starting to develop idea that functional programming is bunch of command, decorator, proxy design paterns simply with lots and lots of functions.
import { CURRYING } from './currying';


// Not so useful way of transforming side effects into pure functions with wrapper
const data: Record<string, number> ={a:1, b:2, c:3}
// This is a wrapper function for side effect, which is a pure function itself. Pure in sense that it returns same output on every invocation: a function which upon being called get elements from map.
const retrieveKey= (key:string) => () => data[key]


// The protocol for IO class is during construction using of() method pass object that you want later map functions to operate on
// after that you can simply call map with according functions passed on the original object as much as you want.

const compose = (...fns: Array<any>) => (...args: Array<any>) => fns.reduceRight((arg, fn)=>[fn(...arg)], args)[0];


class IO {
    // This value is a function(maybe composed maybe alone function) but you can't observe it's value until you unleash side effects themselves.
    private $value: any;

    static of(obj:any) {
        const functionReturningObj=() => obj
        return new IO(functionReturningObj);
    }
    
    private constructor(fn:any) {
        this.$value = fn;
    }

    public map(fn: any) {
        return new IO(compose(fn, this.$value));
    }

    public invoke(){
        return this.$value()
    }

    inspect() {
        return `IO(${this.$value})`;
    }
}


class FuckingSideEffect {
    public invoke(){
        return "This is text from a fucking side effect function"
    }
}

const io = IO.of(new FuckingSideEffect())
console.log(io.map((data:FuckingSideEffect)=>data.invoke()).invoke())



// Let's see an example for IO and functor used together
class URLFetcherSideEffect {
    public getUrl():string{
        return "www.zoro.com?a=1&b=2&c=3&d=4"
    }
}

// When using functional composition remember that most probably you will need currying to normalize the signatures fo all the functions used.
const ioMap = (fn: any, io: IO) => io.map(fn)
const arrMap = CURRYING.curry((fn: any, arr: any[])=>arr.map(fn))
const split = CURRYING.curry((char: string, s: string)=>s.split(char))
const last = (arr: any[])=>arr[arr.length-1]


// our objective is to get [[a,1],[b,2],[c,3],[d,4]] with functions mapped over IO.
const sideEffect = IO.of(new URLFetcherSideEffect().getUrl())
const complexMappingFunction = compose(arrMap(split('=')), split('&'), last, split('?'))
const resultOfSideEffect = ioMap(complexMappingFunction, sideEffect).invoke()
console.log(resultOfSideEffect)



const findKey = CURRYING.curry((tranformer: any, key: any, arr:any[])=>arr.filter(e=>tranformer(e)===key))
const first = (arr: any[])=>arr[0]

// our objective is to get [[a,1],[b,2],[c,3],[d,4]] with functions mapped over IO.
const sideEffect2 = IO.of(new URLFetcherSideEffect().getUrl())
const findElementWhereArrayFirstIsC=findKey(first)('c')
const complexMappingFunction2 = compose(first, findElementWhereArrayFirstIsC, arrMap(split('=')), split('&'), last, split('?'))
const resultOfSideEffect2 = ioMap(complexMappingFunction2, sideEffect2).invoke()
console.log(resultOfSideEffect2)
