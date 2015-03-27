/* global jest, describe, expect, it */

'use strict';

jest.dontMock('../index.js');
jest.dontMock('lodash');

describe('mixins', function () {

    describe('deepValues', function () {

        it('Correctly assembles values array', function () {
            var _ = require('lodash').runInContext();
            var mixins = require('../index.js');
            _.mixin(_.pick(mixins, 'deepValues'));

            var obj = {
                a: 10,
                b: {
                    c: [11, 12],
                    d: {
                        x: 13,
                        m: {}
                    }
                },
                c: [],
                m: 'variable',
                z: [17, [14, 15, [ 16 ] ] ]
            };

            expect(_.deepValues(obj)).toEqual([10, 11, 12, 13, 'variable', 17, 14, 15, 16]);
        });

    });

    describe('isNumeric', function () {

        var examples = [ 10, 13, '0123', '32132', '12312var', 'var', {}, [], { x: 10 }, [13] ];
        var results = [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ];

        it('correctly checks passed variables', function () {
            var _ = require('lodash').runInContext();
            var mixins = require('../index.js');
            _.mixin(_.pick(mixins, 'isNumeric'));

            examples.forEach(function (example, idx) {
                expect(_.isNumeric(example)).toBe(Boolean(results[idx]));
            });
        });

    });


    describe('compareInt', function () {

        it('correctly compares numbers and string', function () {
            // length of each string must be >= 10
            var pairs = [
                2131231333,
                '312312312312',
                '12748192412489124091284102',
                '12748192412489124091284101',
                10,
                '12748192412489124091284102',
                11,
                '318293018239012830912801231231231',
                13
            ].reverse();

            // [a, b].sort(_.compareInt) -> expected result
            var resultMatrix = [
                10,
                11,
                13,
                2131231333,
                '312312312312',
                '12748192412489124091284101',
                '12748192412489124091284102',
                '12748192412489124091284102',
                '318293018239012830912801231231231'
            ];

            var _ = require('lodash').runInContext();
            var mixins = require('../index.js');
            _.mixin(_.pick(mixins, 'compareInt'));

            pairs.sort(_.compareInt);
            expect(pairs).toEqual(resultMatrix);

        });

        it('correctly compares numbers and string, no matter what their length is', function () {

            var pairs = [
                10,
                13,
                14,
                2131231333,
                '312312312312',
                '12748192412489124091284102',
                15,
                11,
                '12748192412489124091284101',
                '12748192412489124091284102',
                '318293018239012830912801231231231'
            ].reverse();

            // [a, b].sort(_.compareInt) -> expected result
            var resultMatrix = [
                10,
                11,
                13,
                14,
                15,
                2131231333,
                '312312312312',
                '12748192412489124091284101',
                '12748192412489124091284102',
                '12748192412489124091284102',
                '318293018239012830912801231231231'
            ];

            var _ = require('lodash').runInContext();
            var mixins = require('../index.js');
            _.mixin(_.pick(mixins, ['compareInt', 'compareNumericStrings']));

            pairs.sort(function (a, b) {
                // it relies on this binding, so either bind to _, or call it like this
                return _.compareNumericStrings(a, b);
            });
            expect(pairs).toEqual(resultMatrix);

        });

    });

    describe('compactObject', function () {

        it('Correctly removes falsy values', function () {
            var _ = require('lodash').runInContext();
            var mixins = require('../index.js');
            _.mixin(_.pick(mixins, 'compactObject'));

            var obj = {
                a: 10,
                b: {},
                c: [],
                d: 'string',
                e: true,
                f: ['danton'],
                mandy: null,
                mandyx: 0,
                transton: undefined,
                gulpy: false,
                tonny: ''
            };

            expect(_.compactObject(obj)).toEqual({
                a: 10,
                b: {},
                c: [],
                d: 'string',
                e: true,
                f: ['danton']
            });

        });

    });

});
