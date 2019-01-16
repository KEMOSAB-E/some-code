Function.prototype.call1 = function (context) {
    //获取this
    context.fn = this;
    //执行函数
    context.fn();
    //删除函数
    delete context.fn;
}
let foo = {
    v:1
}
function bar() {
    console.log(this.v);    
}
bar.call1(foo);
//接受参数
Function.prototype.call2 =function (context) {
    context.fn = this;
    //使用arguments处理不确定参数
    //es3
    var args = [];
    for (var i = 1; i < arguments.length; i++) {
        args.push('arguments['+i+']')        
    }
    eval('context.fn('+args+')')
    delete context.fn 
}
Function.prototype.call2 =function (context,...args) {
    context.fn = this;
    //es6
    context.fn(...args);
    delete context.fn 
}
let foo1 = {
    value: 1
};

function bar1(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}
bar1.call2(foo1,'kk',28);
//处理this为null情况
Function.prototype.call3 = function (context) {
   context= context||window||global;
   context.fn =this
   var args = [];
   for (let i = 1; i < arguments.length; i++) {
    args.push('arguments['+i+']')       
   } 
   var result = eval('context.fn('+args+')')
   delete context.fn;
   return result;
}
let foo2= {
    value:2
}
function bar2(name,age) {
    return {
        name,
        age,
        value:this.value
    }
}
console.log(bar2.call3(foo2,'kky',90));
/* apply 实现 */
Function.prototype.apply1 = function (context,arr) {
    //apply可以传入数组
    context= Object(context)||window||global;
    context.fn =this;
    var result;
    if(!arr){
        result = context.fn();
    }else{
        //es3
        var args = [];
        for (let i = 0; i < arr.length; i++) {
            args.push('arr['+i+']')            
        }
        result = eval('context.fn('+args+')')
    }
    delete context.fn;
    return result
}
Function.prototype.apply2=function (context,arr) {
    context= Object(context)||window||global;
    context.fn =this;
    var result;
    if(!arr){
        result = context.fn();
    }else{
        //es6
        result = context.fn(...arr)
    }
    delete context.fn;
    return result
}
var arr2=[78,3,5,9,4,222,5,55,5,1];
let max = Math.max.apply1(null,arr2)
console.log(max);
let max2 = Math.max.apply2(null,arr2)
console.log(max2);
