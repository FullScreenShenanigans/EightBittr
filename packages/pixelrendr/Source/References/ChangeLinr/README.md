# ChangeLinr [![Build Status](https://travis-ci.org/FullScreenShenanigans/ChangeLinr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/ChangeLinr)

A general utility for transforming raw input to processed output. Outcomes may 
be cached so repeat runs are O(1).

A ChangeLinr stores a set of "transform" functions that may be applied to input,
along with a listing of what functions to apply in which order. It's then able 
to take inputs, apply the transform functions to the inputs, and return the 
(now cached) output.


## Build Process

ChangeLinr uses [Grunt](http://gruntjs.com/) to automate building, which 
requires [Node.js](http://node.js.org). The process is straightforward; see 
[Grunt's help page](http://gruntjs.com/getting-started) for more info.

To build from scratch, install NodeJS, and run the following commands:

```
npm install
grunt
```

The output will now be in the /dist folder. Source codes will be in /dist/src,
and a zipped version will be in /dist.


## Basic Architecture

#### Important APIs

* **process(***`data[, key[, attributes]]`***)** - Applies the pipeline of
transforms to the input data. If doMakeCache is on, the outputs of this are
stored in cache and cacheFull.

* **processFull(***`data[, key[, attributes]]`***)** - Calls process on the
same inputs, then returns an object containing the cached outputs of each
pipeline function.

#### Important Member Variables

* **transforms** *`Object<String, Function>`* - A table mapping String keys to
Functions, so they can be used in the pipeline.

* **pipeline** *`Array<String>`*- The ordered list of transforms to be applied
to inputs in the process call.

* **cache** *`Object<String, Mixed>`* - Previously generated outputs of
processing.

* **cacheFull** *`Object<String, Mixed>`* - Previously generated outputs of
each function in the pipeline functions.

#### Constructor Arguments

* **pipeline** *`String[]`*

* **transforms** *`Object<String, Function>`*

* **[doMakeCache]** *`Boolean`* - Whether this should keep a cache. Defaults to
true.

* **[doUseCache]** *`Boolean`* - Whether this should use the cache. Defaults to
true.

* **[doUseGlobals]** *`Boolean`* - Whether the pipeline is allowed to reference
global variables (rather than just those in transforms). Defaults to false.


## Sample Usage

1.  Creating and using a ChangeLinr to square numbers.

  ```javascript
  var ChangeLiner = new ChangeLinr({
          "transforms": {
           "square": function (number) {
               return number * number;
           }    
       },
      "pipeline": ["square"]
  });
  console.log(ChangeLiner.process(7, "Test")); // 49
  console.log(ChangeLiner.getCached("Test")); // 49
  ```

2. Creating and using a ChangeLinr to calculate Fibonacci numbers.

  ```javascript
  var ChangeLiner = new ChangeLinr({
      "transforms": {
          "fibonacci": function (number, key, attributes, ChangeLiner) {
              if (!number) {
                  return 0;
              } else if (number === 1) {
                  return 1;
              }
              return ChangeLiner.process(number - 1) + ChangeLiner.process(number - 2);
          }
      },
      "pipeline": ["fibonacci"]
  });
  console.log(ChangeLiner.process(7)); // 13
  console.log(ChangeLiner.getCache()); // {0: 0, 1: 1, ... 6: 8, 7: 13}
  ```

3. Creating and using a ChangeLinr to lowercase a string, remove whitespace,
   and sum the character codes of the result. 

  ```javascript
  var ChangeLiner = new ChangeLinr({
      "transforms": {
          "toLowerCase": function (string) {
              return string.toLowerCase();
          },
          "removeWhitespace": function (string) {
              return string.replace(/\s/g, '');
          },
          "sum": function (string) {
              var total = 0,
                  i;
              for(i = 0; i < string.length; i += 1) {
                  total += string.charCodeAt(i);
              }
              return total;
          }
      },
      "pipeline": ["toLowerCase", "removeWhitespace", "sum"]
  });
  console.log(ChangeLiner.process("Hello world!", "Test")); // 1117
  console.log(ChangeLiner.getCached("Test")); // 1117
  ```
