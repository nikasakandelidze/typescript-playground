/*
 * A Functor is a type that implements map and obeys some laws
 */

import { compose } from "./compose";
import { CURRYING } from "./currying";

// Functor can be used in any case where you don't know for sure that value will be returned
// Functors are a good idea when you want to invoke series of functions on the transformation seqeuence of a value
class  Functor<T=any>{
    private value: T;
    static of<U>(value: U){
        return new Functor<U>(value)
    }

    private constructor(value: T){
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
const result: Functor<number> = num1.map(increaseBy10)
console.log(num1.inspect())
console.log(result.inspect())
console.log(num1.inspect())


const arrayMapper = CURRYING.curry((f: any, array: any[]) => array.map(element=>f(element)))

// External mapper invocation
// This will be useful when trying to use functor within compose pipeline of functions since every prev output is next-s input and usually these i/o-s are functors at some point in time.
const functorMap = CURRYING.curry((f: any, functor:Functor<any>): Functor<any>=>functor.map(f))



const result3: Functor<number> = functorMap(increaseBy10)(num1)
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

const maybeAddresses = arrayMapper(compose(functorMap(appendDateType), Functor.of, creationDateProp))(addresses)
console.log(maybeAddresses)


// We can use functor whenevr we aren't sure that computation will for sure return some value
// In this case amount might be much more than present balance in which case we'll simply won't do anything.
const withdraw = CURRYING.curry((amount: number, {balance}:{balance: number}) => Functor.of(amount > balance ? undefined : {balance: balance - amount}))
const convertToCurrencyFactor = CURRYING.curry((factor: number, amount: number)=>factor * amount)

// One of the best benefits of Functor-s is that if at some point in time functor doesn't have a value,
// functions further in time won't even be executed for them and computational cost will be reserved.
// Just like in the below example of not having enough balance, after widthdraw(50) return {value:undefined} rest of compose functions aren't even invoked
const withdrawResult1 = compose(functorMap(convertToCurrencyFactor(2)), functorMap(prop('balance')), withdraw(30))({balance: 40})//enough balance
const withdrawResult2 = compose(functorMap(convertToCurrencyFactor(2)), functorMap(prop('balance')), withdraw(50))({balance: 40})//not enough balance
console.log(withdrawResult1, withdrawResult2)


// here we introduce guard condition for Functor where we simply want to return alternative value instead of nothing
const noValueMissing = CURRYING.curry(<T> (res: T, f: any, functor: Functor<T>)=>{
    if(functor.isNothing()){
        return Functor.of(res)
    }
    return functor.map(f)
})

const widthrawResult3 = compose(noValueMissing('No sufficient balance', compose(convertToCurrencyFactor(3), prop('balance'))), withdraw(10))({balance: 20})
const widthrawResult4 = compose(noValueMissing('No sufficient balance', compose(convertToCurrencyFactor(3), prop('balance'))), withdraw(40))({balance: 20})
console.log(widthrawResult3, widthrawResult4)