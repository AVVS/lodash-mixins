'use strict';

var push = Array.prototype.push;

/**
 * Accepts object and returns deepValues
 * @param {Object} obj
 */
exports.deepValues = function deepValues(obj) {
    var res = [],
        self = this,
        forOwn = this.forOwn,
        isObject = this.isObject;

    forOwn(obj, function iterateOverOwnProperties(value) {
        if(isObject(value)) {
            push.apply(res, deepValues.call(self, value));
        } else {
            res.push(value);
        }
    });

    return res;
};

/**
 * Checks if passed value is numeric, can have leading 0
 * @param {String|Number} id
 */
exports.isNumeric = function (id) {
    // check that its not an array, because of [10].toString => '10'
    return /^\d+$/.test(id) && !this.isArray(id);
};

/**
 * Compares big int, use in the js.sort function
 * Smaller integers will be on top
 * @param {String} a
 * @param {String} b
 */
exports.compareInt = function (a, b) {
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
};

/**
 * Compares numeric string (js sucks, because it doesnt handle 64 bit ints) -
 * this can be used to sort numeric strongs
 * @param {String} numericIdA
 * @param {String} numericIdB
 */
exports.compareNumericStrings = function (numericIdA, numericIdB) {
    var compareInt = this.compareInt;

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
};

/**
 * this is useful for sorting multiple networks of the same value
 * @param {Object} a { network, id }
 * @param {Object} b { network, id }
 */
exports.sortNetworks = function (a, b) {
    var find = this.find,
        arrayify = this.arrayify,
        compareNumericStrings = this.compareNumericStrings,
        isNumeric = this.isNumeric;

    // sort matching networks only
    if (a.network === b.network) {
        switch (a.network) {
            case 'facebook':
                var idsA = arrayify(a.id);
                var idsB = arrayify(b.id);
                var numericIdA = find(idsA, isNumeric);
                var numericIdB = find(idsB, isNumeric);
                return compareNumericStrings(numericIdA, numericIdB);

            // dont care
            default:
                return 0;
        }
    }

    return 0;
};

/**
 * Creates array if passed object is not one, otherwise noop
 * @param  {Mixed} data
 * @return {Array}
 */
exports.arrayify = function (data) {
    return this.isArray(data) ? data : [data];
};

/**
 * Accepts object and returns shallow copy with keys that resolve to
 * truthy values
 * @param {Object} object
 */
exports.compactObject = function (object) {
    var output = {};

    this.forOwn(object, function (value, key) {
        if (value) {
            output[key] = value;
        }
    });

    return output;
};
