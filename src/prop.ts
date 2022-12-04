import { compose } from "./compose"
import { CURRYING } from './currying';



const f = (a:any,b:any,c:any) => a*b*c
console.log(f(1,2,3))
const curriedF=CURRYING.curry(f)
console.log(curriedF(1)(2)(3))


const prop = CURRYING.curry((property: string, obj: any): any=>obj[property])

type User = {id: number, name:string, auth:{ token: string, timestamp: string}}
const user: User = {id:1, name:'nika', auth:{ token: 'qweasdzxc123', timestamp: 'now'}}
console.log(prop('name')(user))
console.log(prop('id')(user))

const getTokenOf = compose(prop('token'), prop('auth'))
const token = getTokenOf(user)
console.log(token)
