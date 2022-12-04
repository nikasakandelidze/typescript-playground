/*
 * A Functor is a type that implements map and obeys some laws
 */

import { compose } from "./compose";
import { CURRYING } from "./currying";

// Functor can be used in any case where you don't know for sure that value will be returned
class  Functor<T=any>{
    private value: T;
    static of<U>(value: U){
        return new Functor<U>(value)
    }

    constructor(value: T){
        this.value = value;
    }

    public isNothing(){
        return this.value === null || this.value === undefined
    }

    public map<O>(f: (input: T)=>O): Functor<O|T>{
        return this.isNothing() ? this : Functor.of(f(this.value))
    }

    public inspect(): string {
        return this.isNothing() ? "Nothing" : this.value + ""
    }
}

// Example of functor calling map directly and indirectly using explicit mapper
const increaseBy10 = (x: number) => x+10
const num1: Functor<number> = Functor.of(1)
const result: Functor<number> = num1
    .map(increaseBy10)
console.log(num1.inspect())
console.log(result.inspect())
console.log(num1.inspect())


const mapper = CURRYING.curry((f: any, array: any[]) => array.map(element=>f(element)))

// External mapper invocation
// This will be useful when trying to use functor within compose pipeline
const functorMapper = CURRYING.curry((f: any, functor:Functor<any>): Functor<any>=>functor.map(f))



const result3: Functor<number> = functorMapper(increaseBy10)(num1)
console.log(result3.inspect())

// Maybe
type Address = {
    title: string
    creationDate?: string
}

const addresses: Address[] = [{title:'Asatiani'}, {title:'Meskhishvili', creationDate:"01-01-1997"}, {title:'Rustaveli'}]
const prop=CURRYING.curry((prop:string, obj: any) => obj[prop])
const creationDateProp = prop('creationDate')
const appendDateType = (input: string) => `Date: ${input}`

const maybeAddresses = mapper(compose(functorMapper(appendDateType), Functor.of, creationDateProp))(addresses)
console.log(maybeAddresses)