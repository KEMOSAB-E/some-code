const isObject = x => typeof x === 'object' && x != null;
const find =(arr,item)=> {
    for (let i = 0; i < arr.length; i++) {
        if (item === arr[i].source) {
            return arr[i]
        }
        
    }
    return null
}



export function cloneDeep(source) {
    var target = {};
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (typeof source[key] === 'object') {
                target[key] = cloneDeep(source[key]);
            } else {
                target[key] = source[key];
            }

        }
    }
    return target;
}
//参数处理 数组兼容
export function cloneDeep1(source) {
    if (!isObject(source)) return source;
    var  target = Array.isArray(source)?[]:{};
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source,key)) {
            if (isObject(source[key])) {
                target[key]=cloneDeep1(source[key])
            } else {
                target[key] = source[key];
            }
            
        }
    }

    return target;
}
//处理循环引用 利用weakmap
export function cloneDeep2(source,hash = new WeakMap()) {
    if (!isObject(source)) return source;
    if (hash.has(source))  return hash.get(source);

    var target = Array.isArray(source)?[]:{};
    hash.set(source,target);
    
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source,key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep2(source[key],hash);
            } else {
                target[key] = source[key];
            }
            
        }
    }
    return target;
}
//处理循环引用 利用数组
export function cloneDeep3(source,uniqueList) {
    if(!isObject(source)) return source;
    if(!uniqueList) uniqueList=[];

    var target = Array.isArray(source)?[]:{};

    var uniqueData = find(uniqueList,source);
    if (uniqueData) {
        return uniqueData.target;
    }
    uniqueList.push({
        source:source,
        target:target
    })
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source,key)) {
            if (isObject(source[key])) {
                target[key]=cloneDeep3(source[key],uniqueList)
            } else {
                target[key] = source[key];
            }
            
        }
    }
    return target;    
}
//Symbol处理 Object.getOwnPropertySymbols
export function cloneDeep4(source,hash = new WeakMap()) {
    if(!isObject(source)) return source;
    if(hash.has(source)) return hash.get(source);

    let target = Array.isArray(source)?[]:{};
    hash.set(source,target);

    let symKeys = Object.getOwnPropertySymbols(source);
    if (symKeys.length) {
        symKeys.forEach(symKey => {
            if (isObject(source[symKey])) {
                target[symKey] = cloneDeep4(source[symKey],hash);
            } else {
                target[symKey] = source[symKey];
            }
        });
    }

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source,key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep2(source[key],hash);
            } else {
                target[key] = source[key];
            }
            
        }
    }


    return target;
}
//Symbol处理 Reflect.ownKeys
export function cloneDeep5(source,hash = new WeakMap()) {
    if(!isObject(source)) return source;
    if(hash.has(source)) return hash.get(source);
    let target = Array.isArray(source)?[]:{};
    hash.set(source,target);
    Reflect.ownKeys(source).forEach(key=>{
        if (isObject(source[key])) {
            target[key] = cloneDeep5(source[key],hash)
        } else {
            target[key] =source[key];
        }
    })
    return target;
}
//处理Maximum call stack size exceeded
export function cloneDeep6(source) {
    const root = {};
    const hash = new WeakMap();
    const loopList=[{
        parent:root,
        key:undefined,
        data:source
    }]
    while (loopList.length) {
        const node = loopList.pop();
        const {parent,key,data} = node;

        let res = parent;
        if (typeof key != undefined) {
            res = parent[key] = {};
        }
        if (hash.has(data)) {
            parent[key] = hash.get(data);
            break;
        }
        hash.set(data,res)

        for (const k in data) {
            if (data.hasOwnProperty(k)) {
               if (isObject(data[k])) {
                   loopList.push({
                       parent:res,
                       key:k,
                       data:data[k]
                   })
               } else {
                   res[k] = data[k];
               }
                
            }
        }
    }
    return root;
}
export function cloneDeep7(source){
    const root = {};
    const uniqueList = [];
    const loopList=[{
        parent:root,
        key:undefined,
        data:source
    }]
    while (loopList.length) {
        const node = loopList.pop();
        const {parent,key,data} = node;

        let res = parent;
        if (typeof key != undefined) {
            res = parent[key] = {};
        }
        let uniqueData = find(uniqueList,data);
        if (uniqueData) {
            parent[key] = uniqueData.target;
            break
        }
        uniqueList.push({
            source:data,
            target:res
        })

        for (const k in data) {
            if (data.hasOwnProperty(k)) {
               if (isObject(data[k])) {
                   loopList.push({
                       parent:res,
                       key:k,
                       data:data[k]
                   })
               } else {
                   res[k] = data[k];
               }
                
            }
        }
    }
    return root;
}