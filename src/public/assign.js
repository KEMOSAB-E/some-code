//复制多个源对象的值到目标对象上
Object.defineProperty(Object,'assign1',{
    value(target){
        console.dir(target);
        'use strict';//防止对象属性writable为false静默失败
        if (target == null) {//不能使用undefined或null
            throw new Error('Cannot convert undefined or null to object')
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
                for (const nextKey in nextSource) {
                    //非原型链
                    /**
                     * 兼容包装对象 
                     * var a ="abc"; 
                     * Object(a)
                     * String
                            0: "a"
                            1: "b"
                            2: "c"
                            length: 3
                            __proto__: String
                            直接nextSource.hasOwnProperty(key)会报错
                     */
                    if (Object.prototype.hasOwnProperty.call(nextSource,nextKey)) {
                        to[nextKey] = nextSource[nextKey];//浅拷贝
                    }                
                }
            }            
        }
        return to;
    },
    writable:false,
    configurable:false
})


let a = {
    name: "advanced",
    age: 18
}
let b = {
    name: "kemosabe",
    next:'dd',
    book: {
        title: "You Don't Know JS",
        price: "45"
    }
}
Object.defineProperty(b,'p',{
    value(v){
        return v;
    },
    enumerable:false
})

Object.defineProperty(b,'q',{
    value:2,
    enumerable:true
})
let c = Object.assign1(a, b);
console.log(c);
/**
 * https://mp.weixin.qq.com/s/s6S-_SMSPRgD7dKsdNCy-Q
 */