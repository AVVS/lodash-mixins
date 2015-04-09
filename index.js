'use strict';

var push = Array.prototype.push;
var possibleLodashModuleNames = ['lodash', 'lodash-node', 'lodash-compat'];
var _;

for (var i = 0; i < possibleLodashModuleNames.length; i++) {
    try {
        _ = require(possibleLodashModuleNames[i]);
        break;
    } catch (e) {

    }
}

if (!_ || typeof _ !== 'function') {
    throw new Error('Must have lodash, lodash-node or lodash-compat in dependencies');
}

var _forOwn = _.forOwn,
    _isObject = _.isObject,
    _isEmpty = _.isEmpty,
    _isArray = _.isArray,
    _find = _.find,
    _isFunction = _.isFunction;

/**
 * Accepts object and returns deepValues
 * @param {Object} obj
 */
function deepValues(obj) {
    var res = [];

    _forOwn(obj, function iterateOverOwnProperties(value) {
        if (_isObject(value)) {
            push.apply(res, deepValues(value));
        } else {
            res.push(value);
        }
    });

    return res;
}

/**
 * Checks if passed value is numeric, can have leading 0
 * @param {String|Number} id
 */
function isNumeric(id) {
    // check that its not an array, because of [10].toString => '10'
    return /^\d+$/.test(id) && !_isArray(id);
}

/**
 * Compares big int, use in the js.sort function
 * Smaller integers will be on top
 * @param {String} a
 * @param {String} b
 */
function compareInt(a, b) {
    a = a.toString();
    b = b.toString();

    var aa = [0,0,0],
        ba = [0,0,0],
        i = 3;

    while (a.length) {
        aa[--i] = parseInt(a.slice(-9));
        a = a.slice(0,-9);
    }

    i = 3;
    while (b.length) {
        ba[--i] = parseInt(b.slice(-9));
        b = b.slice(0,-9);
    }

    if (aa[0] === ba[0]) {
        if (aa[1] === ba[1]) {
            if (aa[2] === ba[2]) {
                return 0;
            } else if (aa[2] > ba[2]) {
                return 1;
            }
            return -1;
        } else if (aa[1] > ba[1]) {
            return 1;
        }
        return -1;
    } else if (aa[0] > ba[0]) {
        return 1;
    }

    return -1;
}

/**
 * Compares numeric string (js sucks, because it doesnt handle 64 bit ints) -
 * this can be used to sort numeric strongs
 * @param {String} numericIdA
 * @param {String} numericIdB
 */
function compareNumericStrings(numericIdA, numericIdB) {
    if (numericIdA && numericIdB) {
        numericIdA = numericIdA.toString();
        numericIdB = numericIdB.toString();

        var lengthA = numericIdA.length,
            lengthB = numericIdB.length;

        if (lengthA < 10 && lengthB < 10) {
            return parseInt(numericIdA, 10) - parseInt(numericIdB, 10);
        } else if (lengthA < 10) {
            return -1;
        } else if (lengthB < 10) {
            return 1;
        } else {
            return compareInt(numericIdA, numericIdB);
        }

    } else if (numericIdA) {
        return -1;
    } else if (numericIdB) {
        return 1;
    } else {
        return 0;
    }
}

/**
 * Creates array if passed object is not one, otherwise noop
 * @param  {Mixed} data
 * @return {Array}
 */
function arrayify(data) {
    return _isArray(data) ? data : [data];
}


/**
 * this is useful for sorting multiple networks of the same value
 * @param {Object} a { network, id }
 * @param {Object} b { network, id }
 */
function sortNetworks(a, b) {
    // sort matching networks only
    if (a.network === b.network) {
        switch (a.network) {
            case 'facebook':
                var idsA = arrayify(a.id);
                var idsB = arrayify(b.id);
                var numericIdA = _find(idsA, isNumeric);
                var numericIdB = _find(idsB, isNumeric);
                return compareNumericStrings(numericIdA, numericIdB);

            // dont care
            default:
                return 0;
        }
    }

    return 0;
}

function isObject(datum) {
    if (!_isObject(datum)) {
        return false;
    }

    var type = typeof datum;
    if (type === 'string' || type === 'number') {
        return false;
    }

    return true;
}

function assessObject(object) {

    if (_isEmpty(object)) {
        return false;
    }

    if (_isFunction(object)) {
        return object;
    }

    if (_isArray(object)) {
        var shallowOutput = [];
        object.forEach(function (datum) {
            if (datum) {

                if (isObject(datum)) {
                    shallowOutput.push(datum);
                    return;
                }

                var assessedValue = assessObject(datum);
                if (assessedValue) {
                    shallowOutput.push(assessedValue);
                    return;
                }

            }

        });

        if (shallowOutput.length === 0) {
            return false;
        }

        return shallowOutput;
    }

    var compactedObject = compactObjectDeep(object);
    if (_isEmpty(compactedObject)) {
        return false;
    }

    return compactedObject;
}

/**
 * Creates object "compactor" iterator
 * @param {Object}  output
 * @param {Boolean} isDeep
 */
function createObjectIterator(output, isDeep) {

    if (isDeep) {
        return function compactObjectIteratorDeep(value, key) {

            if (value) {

                if (isObject(value)) {

                    var assessedValue = assessObject(value);
                    if (assessedValue !== false) {
                        output[key] = assessedValue;
                    }

                    return;
                }

                output[key] = value;
            }

        };

    }

    return function compactObjectIterator(value, key) {
        if (value) {
            output[key] = value;
        }
    };
}


/**
 * Accepts object and returns shallow copy with keys that resolve to
 * truthy values
 * @param {Object}  object
 * @param {Boolean} deep  - if specified, will remove empty array and objects
 */
function compactObject(object, deep) {
    var output = {};

    _forOwn(object, createObjectIterator(output, deep));

    return output;
}

/**
 * Shorthand for compactObject(object, true);
 * @param {Object} object
 */
function compactObjectDeep(object) {
    return compactObject(object, true);
}

// public API

module.exports = {
    isNumeric: isNumeric,
    deepValues: deepValues,
    compareInt: compareInt,
    compareNumericStrings: compareNumericStrings,
    arrayify: arrayify,
    sortNetworks: sortNetworks,
    compactObject: compactObject,
    compactObjectDeep: compactObjectDeep
};
