# GameStartr

GameStartr is a JavaScript game engine used as a base for creating sprite-based
2D games, particularly retro remakes such as FullScreenMario. The GameStartr
class inherits from EightBittr and requires the use of 18 modules, all of which
are sub-directories here and follow the same naming scheme. 

GameStartr and EightBittr themselves contain game-independent functions for 
child implementations to make use of, particularly involving physics
manipulations, graphics rendering, and reset functions. EightBittr as a parent
class does not contain functions that reference the modules; GameStartr does.


## Basic Usage

GameStartr does nothing on its own - you must create a child class. That child 
class should then call the GameStartr prototype on itself, specifying itself
as the constructor, and passing in a "customs" argument.

```javascript
var GameStartrProto = new GameStartr();

function MySubClass(customs) {
    GameStartr.call(this, {
        "customs": customs,
        "constructor": MySubClass
    });
}

MySubClass.prototype = GameStartrProto;
```

To add constants (static variables) to the sub-class, list those constants 
in the GameStartr constructor call. It's also a good idea to wrap the code
creating your sub-class in a closure anyway.

```javascript
var MySubClass = (function () {
    var GameStartrProto = new GameStartr();

    function MySubClass(customs) {
        GameStartr.call(this, {
            "customs": customs,
            "constructor": MySubClass,
            "constants": [
                "constantOne",
                "constantTwo"
            ]
        })
    }

    MySubClass.prototype = GameStartrProto;
    MySubClass.constantOne = "foo";
    MySubClass.constantTwo = "bar";

    return MySubClass;
});
```

Actual requirements vary: research each module before attempting to use them.