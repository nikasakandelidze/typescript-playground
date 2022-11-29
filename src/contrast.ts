
namespace OOP_WAY {
  /*
    OOP way which is a bit confusing
  */
  export class Flock {
    seagulls: number;

    constructor(n: number) {
      this.seagulls = n;
    }

    conjoin(other: Flock) {
      this.seagulls += other.seagulls;
      return this;
    }

    breed(other: Flock) {
      this.seagulls = this.seagulls * other.seagulls;
      return this;
    }
  }
}

namespace FUNCTIONAL_WAY {
  /*
    Functional way should be more understandable
  */
  export const conjoin = (firstFlock:number, secondFlock:number) => firstFlock + secondFlock;
  export const breed = (firstFlock:number, secondFlock:number) => firstFlock * secondFlock;
}

namespace MEMOIZATION {
  type VarargsFunction<T> = (...args: Array<T>)=> T

  export const memoize = <T> (f: VarargsFunction<T>) => {

    const cache: Record<string, T> = {}

      return (...args: Array<T>) => {
        const inputArgs: string = JSON.stringify(args);
        if(!cache[inputArgs]){
          console.log("Not found in cache, calculating value.")
          cache[inputArgs] = f(...args)
        }else{
          console.log("Found in cache")
        }
        return cache[inputArgs]
      }
  }
}

const oopFlocksTest = () => {
  const flockA = new OOP_WAY.Flock(4);
  const flockB = new OOP_WAY.Flock(2);
  const flockC = new OOP_WAY.Flock(0);
  const oopResult = flockA
    .conjoin(flockC)
    .breed(flockB)
    .conjoin(flockA.breed(flockB))
    .seagulls;
  // As you see it's extermly hard to analyze and follow the code even in it's simplest form
  // We expected 16 but instead of last conjoin term we got 32
  console.log(oopResult)
}

const functionalFlockTest = () => {
  const flockA1: number = 4;
  const flockB1: number = 2;
  const flockC1: number = 0;
  const conjoin = FUNCTIONAL_WAY.conjoin;
  const breed = FUNCTIONAL_WAY.breed;
  const functionalResult: number = conjoin(breed(conjoin(flockA1, flockC1), flockB1), breed(flockA1, flockB1));
  console.log(functionalResult)

  /* We could even make the functional expression above easier to read taking facts that:
    flockC1=0 and associative and cummutative nature of product and sum operations(which effectively are the same as conjoin and breed)
  */
  const easierFunctionalResult: number = 2 * breed(flockA1, flockB1);
  console.log(easierFunctionalResult)
}


const memoizationTest = () => {
  const add =(a:number, b:number)=> a+b;
  const varArgsAdd = (...args: any)=> add(args[0], args[1]);
  const cachedAdd = MEMOIZATION.memoize<number>(varArgsAdd)
  const result1=cachedAdd(1,2)
  const result2=cachedAdd(1,2)
  console.log(result1, result2)
}


oopFlocksTest()
functionalFlockTest()
memoizationTest()



