//target:持续触发事件，每隔一段时间，只执行一次事件

function throttle(func,wait) {
    var context,args;
    var previous=0;
    return function () {
        var now = +new Date();
        context=this;
        args= arguments;
        if (now - previous > wait ) {
            func.apply(context,args)
        }
    }
}
//v2
function throttle1(func,wait) {
    var timeout;
    var previous=0;
    return function () {
        var context = this,
            args = arguments;
       if (!timeout) {
           timeout = setTimeout(function () {
               timeout=null
            func.apply(context,args);
           },wait)
       } 
    }
}
//鼠标移入能立刻执行，停止触发的时候还能再执行一次
function throttle2(func,wait) {
    var timeout,context,args,result;
    var previous = 0;
    var later = function () {
        previous = +new Date();
        timeout = null;
        func.apply(context,args)
    }
     var throttled = function () {
         var now =+new Date();
         var remaining = wait - (now - previous);
         context = this;
         args= arguments;
         if (remaining <= 0 || remaining > wait) {
             if (timeout) {
                 clearTimeout(timeout)
                 timeout = null;
             }
             previous = now;
             func.apply(context,args)
         }else if(!timeout){
             timeout =setTimeout(later,remaining)
         }
         
     }
     return throttled;
}

//可定制执行
/**
 * 
 * @param {Function} func   调用函数
 * @param {Number} wait ms
 * @param {Object} options {}
 */
//leading：false 表示禁用第一次执行
//trailing: false 表示禁用停止触发的回调
function throttle3(func,wait,options) {
    var timeout,context,args,result;
    var previous = 0;
    if (!options) options = {};
    var later =function () {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        func.apply(context,args)
        if(!timeout) context = args = null;
    }
    var throttled = function () {
        var now = new Date().getTime();
        if (!pervious && options.leading === false) {
            previous = now;
        }
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining<=0||remaining>wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context,args)
            if(!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false ) {
           timeout = setTimeout(later,remaining) 
        }
    }
    throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = null;
    }
    return throttled;
}

/**
 * container.onmousemove = throttle(getUserAction, 1000);
 * 
 * container.onmousemove = throttle(getUserAction, 1000, {
 *      leading: false
 * });
 * container.onmousemove = throttle(getUserAction, 1000, {
 *      trailing: false
 * });
 */
