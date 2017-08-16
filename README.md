# any-leaf 
any-leaf provides utility methods for traversing a JSON object and performing checks or returning values from leaf nodes.  This library has not dependencies

## Installation:
    npm install --save any-leaf

## Usage:

```javascript
import { getLeaves } from "any-leaf";

const test = {
    a: {
        i: {
            p: [ 'value1', { test: 'value2'}]
            q: {
                x: 12,
                y: null
            }
        }
    },
    b: [
        { i: 'value3' },
        { i: 'value4', j: ['value5']}
    ]
};

const result = getLeaves
console.log(JSON.stringify())

//[
//    {
//        "path": "a.i.p.0",
//        "value": "value1"
//    },
//    {
//        "path": "a.i.p.1.test",
//        "value": "value2"
//    },
//    {
//        "path": "a.i.q.x",
//        "value": 12
//    },
//    {
//        "path": "a.i.q.y",
//        "value": null
//    },
//    {
//        "path": "b.0.i",
//        "value": "value3"
//    },
//    {
//        "path": "b.1.i",
//        "value": "value4"
//    },
//    {
//        "path": "b.1.j.0",
//        "value": "value5"
//    }
//]


```


## API:
    In addition to the documenation below, each method takes in an optional include ([string]) and exclude ([string]) parameter used to include or exclude subtree sections of the subject object. 


```javascript
const include = [ 'a.i.p', 'b'] // same for exclude, will exclude all nodes under the listed paths
```

### anyLeaf(value: object, fn: function): boolean
    performs the check defined by fn on all leaf nodes and returns true if any leaf node passes the check (similar to Array.prototype.some).  The fn callback will be called with each value in the format: { path: string, value: any }

```javascript
anyLeaf(test, leaf => leaf.value === 'value1') // true
anyLeaf(test, leaf => leaf.value === 'someValNotALeaf') // false
```

### allLeaves(value: object, fn: function): boolean
    same as anyLeaf except all leaves must pass the check defined by the callback fn

```javascript
allLeaves(test, leaf => leaf.value === 'value1') // false
allLeaves(test, leaf => leaf.value !== undefined) // true
```

### anyLeafTruthy(value: object): boolean
same as anyLeaf with a callback fn specified as leaf => !!leaf.value

```javascript
anyLeafTruthy(test) // true
```

### allLeavesTruthy(value: object): boolean
same as allLeaves with a callback fn specified as leaf => !!leaf.value

```javascript
allLeavesTruthy(test) // false, a.i.q.y === null
```

### anyLeafFalsey(value: object): boolean
same as anyLeaf with a callback fn specified as leaf => !leaf.value

```javascript
anyLeafFalsey(test) // true, a.i.q.y === null
```

### allLeavesFalsey(value: object): boolean
same as allLeaves with a callback fn specified as leaf => !leaf.value

```javascript
allLeavesFalsey(test) // false
```

### getLeaves(value: object): [{path: string, value: any}]
same as getLeaves with a callback fn specified as leaf => leaf

```javascript
getLeaves(test) // false
```

### mapLeaves(value: object, fn: function): [any]
visits each leaf node in the object and runs the callback function on each leaf node in the object and returns an array of values containing the mapped objects

```javascript
mapLeaves(test, leaf => ( myProp: 'my ' + leaf.value )) 
```

### visitLeaves(value: object, fn: function)
visits each leaf node in the object and runs the callback function on each leaf node in the object

```javascript
const myArray = []
visitLeaves(test, leaf => myArray.push(leaf))
```