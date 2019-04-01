function create() {
    let obj = new Object();
    let Con = [].shift.call(arguments);
    obj.__proto__ = Con.prototype;
    let result = Con.apply(obj,arguments);
    return typeof result === "object" ?result :obj;
}
