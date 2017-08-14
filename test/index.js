const assert = require('assert');
const leafUtil = require('../index');
const update = require('immutability-helper');

const truthy = {
  a: {
    i: {
      p: 'tset', 
    },
    j: 'asd',
  },
  b: false,
  c: {
    i: [
      'adf', false
    ]
  },
  d: [
    { t: 'test'},
    { t: null }
  ]    
}

const allTruthy = {
  a: {
    i: {
      p: 'tset', 
    },
    j: 'asd',
  },
  b: 'wer',
  c: {
    i: [
      'adf', 'adf'
    ]
  },
  d: [
    { t: 'test'},
    { t: 'erw' }
  ]    
}

const falsey = {
  a: {
    i: {
      p: false
    },
    j: undefined,
  },
  b: null,
  c: {
    i: [ null, false, undefined]
  }
}

describe('getLeaves', () => {
    const actual = leafUtil.getLeaves(truthy);

    it('should return all leaves', () => {
        assert.strictEqual(actual.length, 7);
    });

    it('should return objects of { path, value }', () => {
        const expected = [
            { path: 'a.i.p', value: 'tset'},
            { path: 'a.j', value: 'asd'},
            { path: 'b', value: false },
            { path: 'c.i.0', value: 'adf'},
            { path: 'c.i.1', value: false },
            { path: 'd.0.t', value: 'test' },
            { path: 'd.1.t', value: null },
        ];
        assert.deepStrictEqual(actual, expected);
    });
});

describe('anyLeafFalsey', () => {
  
  it('should return false when all leaves truthy', () => {
    const actual = leafUtil.anyLeafFalsey(allTruthy);
    assert.strictEqual(actual, false);
  })
  
  it('should return true when one leaf falsey', () => {
    const test = update(allTruthy, { c: { i: { 1: { $set: undefined }}}})
    const actual = leafUtil.anyLeafFalsey(test);
    assert.strictEqual(actual, true);
  })
})

describe('allLeavesFalsey', () => {
  
  it('should return true when all leaves falsey', () => {
    const actual = leafUtil.allLeavesFalsey(falsey);
    assert.strictEqual(actual, true);
  })
  
  it('should return false when one leaf truthy', () => {
    const test = update(falsey, { c: { i: { 1: { $set: 'test' }}}})
    const actual = leafUtil.allLeavesFalsey(test);
    assert.strictEqual(actual, false);
  })
})

describe('mapLeaves', () => {
  
  it('should map leaves accordingly', () => {
    const expected = [
      { path: 'a.i.pY', value: 'tsetX'},
      { path: 'a.jY', value: 'asdX'},
      { path: 'bY', value: 'falseX' },
      { path: 'c.i.0Y', value: 'adfX'},
      { path: 'c.i.1Y', value: 'falseX' },
      { path: 'd.0.tY', value: 'testX' },
      { path: 'd.1.tY', value: 'nullX' },
    ];
    const actual = leafUtil.mapLeaves(truthy, leaf => ({ path: `${leaf.path}Y`, value: `${leaf.value}X`}));
    assert.deepStrictEqual(actual, expected);
  })
})

describe('visitLeaves', () => {
  it('should visit all leaves', () => {

    let actual = '';
    let count = 0;
    const expected = 'a.i.p:tset_a.j:asd_b:false_c.i.0:adf_c.i.1:false_d.0.t:test_d.1.t:null_';
    leafUtil.visitLeaves(truthy, leaf => { 
      count++; 
      actual += `${leaf.path}:${leaf.value}_`;
    });

    assert.strictEqual(actual, expected);
    assert.strictEqual(count, 7);
  });
});

describe('allLeavesTruthy', () => {
  it('should return true if all leaves are truthy', () => {        
    const actual = leafUtil.allLeavesTruthy(allTruthy);
    assert.strictEqual(actual, true);
  });

  it('should return false if one leaf is falsey', () => {   
    let test = update(allTruthy, { d: { 0: { t: { $set: undefined }}}})     
    let actual = leafUtil.allLeavesTruthy(test);
    assert.strictEqual(actual, false);

    test = update(allTruthy, { a: { i: { p: { $set: '' }}}})     
    actual = leafUtil.allLeavesTruthy(test);
    assert.strictEqual(actual, false);
  });
})

describe('anyLeafTruthy', () => {

  it('should return false if all leaves are falsey', () => {      
      const actual = leafUtil.anyLeafTruthy(falsey);
      assert.strictEqual(actual, false);
  });

  it('should return true if any leaf is truthy (deep)', () => {   
      const test = update(falsey, { a: { i: { p: { $set: 'test' }}}})  
      const actual = leafUtil.anyLeafTruthy(test);
      assert.strictEqual(actual, true);
  });

  it('should return true if any leaf is truthy (deep-array)', () => {   
    const test = update(falsey, { c: { i: { 1: { $set: 'test' }}}})  
    const actual = leafUtil.anyLeafTruthy(test);
    assert.strictEqual(actual, true);
  });

  it('should respect include list', () => {
      let actual = leafUtil.anyLeafTruthy(truthy, [ 'b' ]);
      assert.strictEqual(actual, false);

      actual = leafUtil.anyLeafTruthy(truthy, [ 'c.i.0' ]);
      assert.strictEqual(actual, true);

      actual = leafUtil.anyLeafTruthy(truthy, [ 'c.i.1' ]);
      assert.strictEqual(actual, false);

      actual = leafUtil.anyLeafTruthy(truthy, [ 'd' ]);
      assert.strictEqual(actual, true);

      actual = leafUtil.anyLeafTruthy(truthy, [ 'd.0' ]);
      assert.strictEqual(actual, true);

      actual = leafUtil.anyLeafTruthy(truthy, [ 'd.1' ]);
      assert.strictEqual(actual, false);
  });

  it('should respect exclude list', () => {
    let actual = leafUtil.anyLeafTruthy(truthy, null, [ 'a', 'c', 'd' ]);
    assert.strictEqual(actual, false);

    actual = leafUtil.anyLeafTruthy(truthy, null, [ 'a', 'c', 'd.0' ]);
    assert.strictEqual(actual, false);

    actual = leafUtil.anyLeafTruthy(truthy, null, [ 'a', 'c', 'd.0.t' ]);
    assert.strictEqual(actual, false);

    actual = leafUtil.anyLeafTruthy(truthy, null, [ 'a', 'c', 'd.1.t' ]);
    assert.strictEqual(actual, true);
  });
});