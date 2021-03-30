let delEptItem = function(array) {
    let result = array;
    for (let i = 0; i < result.length; i++) {
        if (result[i] === '' || result[i] === null || typeof(result[i]) === undefined) {
            result.splice(i, 1);
            i = i - 1;
        }
    }
    return result;
}

/*
 *函数定义
 *入口参数time,时间戳
 *type字段,确定返回 年-月-日/年-月-日 时-分，有type:1/2区分，默认1
 */
let getDate = function(time, type = 1) {

    let date = new Date(time),
        month = ((date.getMonth() + 1) > 9) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)),
        day = (date.getDate() > 9) ? (date.getDate()) : ('0' + date.getDate()),
        hours = (date.getHours() > 9) ? (date.getHours()) : ('0' + date.getHours()),
        minutes = (date.getMinutes() > 9) ? (date.getMinutes()) : ('0' + date.getMinutes()),
        seconds = (date.getSeconds() > 9) ? (date.getSeconds()) : ('0' + date.getSeconds()),
        result;
    if (type === 1) {
        result = date.getFullYear() + '-' + month + '-' + day;
    } else {
        result = date.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }

    return result;
}


/*
 *函数定义 遍历树，匹配节点里的某个字段，返回某个字段
 *入口参数tree,树
 *key，children字段名
 */
let traverseTree = function(tree, matchValue, matchKey, returnKey, childKey = 'children') {
    let dataList = JSON.parse(JSON.stringify(tree)),
        result = '';

    let checkNode = function(pTree) {
        if (pTree[matchKey] === matchValue) {
            result = pTree[returnKey];
        } else {
            if (pTree[childKey] && pTree[childKey].length !== 0) {
                for (let j = pTree[childKey].length - 1; j >= 0; j--) {
                    checkNode(pTree[childKey][j]);
                }
            }
        }
    }

    checkNode(dataList);

    return result;
}
export {
	delEptItem,
	getDate,
	traverseTree
}
