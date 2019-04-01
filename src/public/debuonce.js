function debounce(func,wait) {
    var timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(func,wait)
    }
}
//修复this，arguments
function debounce1(func,wait) {
    var timeout;
    return function () {
        var args= arguments;
        var context = this;

        clearTimeout(timeout);
        timeout =setTimeout(function () {
            func.apply(context,args)
        },wait)
    }
}
//立即执行
function debounce2(func,wait,immediate) {
    var timeout,result;
    return function () {
        var args= arguments;
        var context = this;

        if (timeout) {
            clearTimeout(timeout)
        }
         if (immediate) {
             var callNow = !timeout;
             timeout = setTimeout(function () {
                 timeout = null;
             },wait)
             if (callNow) {
                result= func.apply(context,args)
             }
         } else{
             timeout =setTimeout(function () {
                 func.apply(context,args)
             },wait)
         }
         return result;  
    }
}
//可以取消
function debounce2(func,wait,immediate) {
    var timeout,result;
    var debounced= function () {
        var args= arguments;
        var context = this;

        if (timeout) {
            clearTimeout(timeout)
        }
         if (immediate) {
             var callNow = !timeout;
             timeout = setTimeout(function () {
                 timeout = null;
             },wait)
             if (callNow) {
                result= func.apply(context,args)
             }
         } else{
             timeout =setTimeout(function () {
                 func.apply(context,args)
             },wait)
         }
         return result;  
    }
    debounced.cancel=function () {
        clearTimeout(timeout)
        timeout = null;
    }
    return debounced;
}
/**
 * 
 * var setUseAction = debounce(getUserAction, 10000, true);
 * container.onmousemove = setUseAction;
 * document.getElementById("button").addEventListener('click', function(){
 *  setUseAction.cancel();
 * })
 */

