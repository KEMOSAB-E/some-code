Function.prototype.bind1 = function (context) {
    //改变this
    var _this = this;
    return function () {
        return _this.apply(context)
    }
}
var foo = {
    value: 1
};

function bar() {
	return this.value;
}

var bindFoo = bar.bind1(foo);

//console.log(bindFoo());
//有的函数会传参
Function.prototype.bind2 = function (context) {
    var _this = this;
    var args = Array.prototype.slice.call(arguments,1);
    return function () {
        var bingArgs = Array.prototype.slice.call(arguments);
        return _this.apply(context,args.concat(bingArgs))
    }
}
var foo1 = {
    value: 1
};

function bar1(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);

}

var bindFoo1 = bar1.bind2(foo, 'daisy');
//bindFoo1('18');
//一个绑定函数也能使用new操作符创建对象
Function.prototype.bind3 = function (context) {
    var _this = this;
    var args = Array.prototype.slice.call(arguments,1);
    var fnBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return _this.apply(this instanceof fnBound ?this:context,args.concat(bindArgs))
    }
    fnBound.prototype = this.prototype;
    return fnBound;
}
var value = 2;

var foo2 = {
    value: 1
};

function bar2(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar2.prototype.friend = 'kevin';

var bindFoo2 = bar2.bind3(foo2, 'daisy');

var obj = new bindFoo2('18');
console.log(obj.habit);
console.log(obj.friend);
//最终优化
Function.prototype.bind4 = function (context) {
    if (typeof this !== 'function') {
        throw new Error('Function.prototype.bind-what is trying to be bound is not callable')
    }
    var _this = this;
    var args = Array.prototype.slice.call(arguments,1);
    var fNOP = function () {};

    var fnBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return _this.apply(this instanceof fNOP ?this:context,args.concat(bindArgs))
    }
    fNOP.prototype = this.prototype;
    fnBound.prototype  = new fNOP();
    return fnBound;
}
