module.exports = {
    anyLeaf,
    allLeaves,
    anyLeafTruthy,
    allLeavesTruthy,
    anyLeafFalsey,
    allLeavesFalsey,
    mapLeaves,
    getLeaves,
    visitLeaves,
};

function anyLeafTruthy(value, include, exclude) {
  return anyLeaf(value, leaf => !!leaf.value, include, exclude)
}

function allLeavesTruthy(value, include, exclude) {
  return allLeaves(value, leaf => !!leaf.value, include, exclude)
}

function anyLeafFalsey(value, include, exclude) {
  return anyLeaf(value, leaf => !leaf.value, include, exclude)
}

function allLeavesFalsey(value, include, exclude) {
  return allLeaves(value, leaf => !leaf.value, include, exclude)
}

function allLeaves(value, check, include, exclude) {
    return !anyLeaf(value, leaf => !check(leaf), include, exclude)
}

function getLeaves(value, include, exclude) {
    return mapLeaves(value, val => val, include, exclude)
}

function mapLeaves(value, mapFn, include, exclude){
    const result = [];
    visitLeaves(value, leaf => result.push(mapFn(leaf)), include, exclude);
    return result;
}

function anyLeaf(value, fn, include, exclude, path = '') {
    if(
        (include && path && !include.some(whiteListPath => (whiteListPath.startsWith(path) || path.startsWith(whiteListPath)))) || 
        (exclude && exclude.includes(path)))
        return;

    if(value !== null && typeof value === 'object') {
        for(let prop in value) {
            if(anyLeaf(value[prop], fn, include, exclude, `${path}${path && '.'}${prop}`))
                return true;
        }
        return false;
    }
    else
        return fn({ path, value });
    
}

function visitLeaves(value, fn, include, exclude, path = '') {
    if((include && path && !include.some(whiteListPath => path.startsWith(whiteListPath))) || (exclude && exclude.includes(path)))
        return;

    if(value !== null && typeof value === 'object') {
        for(let prop in value)
            visitLeaves(value[prop], fn, include, exclude, `${path}${path && '.'}${prop}`);
    }
    else
        fn({ path, value });
}
