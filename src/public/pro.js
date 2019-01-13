function Promise(executor) {
    let self = this;
    self.status = 'pending'
    self.value = undefined;
    self.reason = undefined;
    self.onResolvedCallbacks = [];
    self.onRejectedCallbacks = [];
    function resolve(value) {
        if (self.status === 'pending') {
            self.value = value;
            self.status = 'fulfilled';
            self.onResolvedCallbacks.forEach(function (fn) {
                fn();
            });
        }
    }
    function reject(reason) {
        if (self.status === 'pending') {
            self.reason = reason;
            self.status = 'rejected';
            self.onRejectedCallbacks.forEach(function (fn) {
                fn();
            })
        }
    }
    try {
        executor(resolve, reject); 
    } catch (e) {
        reject(e);
    }
}

function resolvePromise(promise2, x, resolve, reject) {   
    if (promise2 === x) {
        return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'))
    }   
    let called; 
    if ((x != null && typeof x === 'object') || typeof x === 'function') {      
        try {           
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, function (y) { 
                    if (!called) { called = true; } else { return; }
                    resolvePromise(x, y, resolve, reject); 
                }, function (r) {
                    if (!called) { called = true; } else { return; }
                    reject(r);
                });
            } else { 
                resolve(x); 
            }
        } catch (e) { 
            if (!called) { called = true; } else { return; }
            reject(e);
        }
    } else {
      return  resolve(x);
    }
}
Promise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (data) {
        return data
    }
    onRejected = typeof onRejected === 'function' ? onRejected : function (err) {
        throw err;
    }
    let self = this;
    let promise2; 
  
    promise2 = new Promise(function (resolve, reject) {
        if (self.status === 'fulfilled') {
           
            setTimeout(() => {
                try {
                    let x = onFulfilled(self.value);
                   
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            }, 0);
        }
        if (self.status === 'rejected') {
            setTimeout(() => {
                try {
                    let x = onRejected(self.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e)
                }
            }, 0)
        }
        if (self.status === 'pending') {
            
            self.onResolvedCallbacks.push(function () {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(self.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0);
            });
            self.onRejectedCallbacks.push(function () {
                setTimeout(() => {
                    try {
                        let x = onRejected(self.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            })
        }
    });
    return promise2;

}

Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
}

Promise.prototype.finally = function (cb) {
    
    return this.then(function (data) {
        cb();
        return data;
    }, function (err) {
        cb();
        throw err;
    });
}

Promise.reject = function (reason) {
    return new Promise(function (resolve, reject) {
        reject(reason);
    })
}
Promise.resolve = function (value) {
    return new Promise(function (resolve, reject) {
        resolve(value);
    })
}
Promise.deferred = Promise.defer = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd
}
Promise.all = function (promises) {
    return new Promise(function (resolve, reject) {
        let arr = [];
       
        let i = 0;
        function processData(index, data) {
            arr[index] = data; 
            if (++i === promises.length) { 
                resolve(arr);
            }
        }
        for (let i = 0; i < promises.length; i++) {
            let promise = promises[i];
            if (typeof promise.then == 'function') {
                promise.then(function (data) {
                    processData(i, data); 
                }, reject)
            } else {
                processData(i, promise);
            }
        }
    });
}
Promise.race = function (promises) {
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < promises.length; i++) {
            let promise = promises[i];
            if (typeof promise.then == 'function') {
                promise.then(resolve, reject)
            } else {
                resolve(promise);
            }
        }
    })
}
module.exports = Promise;