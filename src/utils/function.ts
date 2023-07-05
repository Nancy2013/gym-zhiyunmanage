
// 随机生成多位数
export const randomInter = (num: number) => {
   let str = Math.random().toString().slice(-num);  // 随机生成多位数
   return str
}

// 根据位数生成位数值
export const multiNumber = (count: number) => {
    let returnValue: string = '';
    for(let i = 0; i < count-1; i++) {
        returnValue += `${0}`
    }
    return returnValue + `${1}`
}

// 根据对象数组某个属性去重
export const uniqueArr = (arr: any, key: any) => {
    const res = new Map()
    return arr.filter((item: any) => !res.has(item[`${key}`]) && res.set(item[`${key}`], 1))
}

// 树形结构
export const convertTree = (arr: any, { id , pid }: any) => {
    let obj: any = {}, newArr: any = [];
    arr.forEach((element: any) => {
         obj[element[id]] = element;
    });
    arr.map((item: any) => {
        if(obj[item[pid]] && item[id] != 0) {
            obj[item[pid]].children && (obj[item[pid]].children.push(item));
            obj[item[pid]].children || (obj[item[pid]].children = [item]);
        } else {
            newArr.push(item);
        }
    })
    return newArr;
}