# Lodash mixins

`npm install mm-lodash -S`

## Usage

Please note, all the mixins heavily rely on value of `this`, so don't forget
to bind when passing to `.sort` or other methods

```js
var _ = require('lodash-node');
var mixins = require('mm-lodash');

// adds all mixins
_.mixin(mixins);

// array of values (non-unique)
var values = _.deepValues(obj);

// obj with removed falsy keys, useful for GC
var compactedObj = _.compactObject(obj);

// etc - all methods below

```


## deepValues

recursively walk over object and gather it's values, return array

## compactObject

check own properties of an object and return shallow copy with falsy properties
removed

## arrayify

Create array from a passed value or return passed array

## compareNumericStrings

Predicate for sorting function, sorts from smaller numbers or numeric strings to bigger ones
Supports any size of the numbers

## compareInt

basically same as previous one, but without optimizations for smaller numbers

## isNumeric

Checks that passed value is numeric and not an array
