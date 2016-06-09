define(["ObjectMakr"], function (ObjectMakrModule) {
    var ObjectMakr = ObjectMakrModule.ObjectMakr;
    var expect = require("chai").expect;

    var mocks = {
        /**
         * @returns An instance of ObjectMakr.
         */
        mockObjectMakr: function (settings) {
            return new ObjectMakr(settings || {
                inheritance: {
                    Animal: {
                        Bird:{
                            Penguin: {}
                        },
                        Mammal: {
                            Dog: {}
                        }
                    }
                },
                properties: {
                    Animal: {
                        name: "",
                        weight: 0,
                        age: 0,
                        wet: false
                    },
                    Penguin: {
                        onMake: function (penguin) {
                            penguin.wet = true;
                        }
                    }
                },
                doPropertiesFull: true,
                indexMap: ["name", "weight", "age"],
                onMake: "onMake"
            })
        },       
        /**
         * A specific class name for tests to use.
         */
        mockClassName: "Penguin",
        /**
         * @returns Sample properties for a generated object.
         */
        mockObjectProperties: function () {
            return {
                name: "John",
                weight: 213,
                age: 4
            };
        },
        /**
         * @returns A small inheritance outline.
         */
        mockInheritance: function () {
            return {
                Organism: {
                    Animal: {},
                    Plant: {}
                }
            };
        },
        /**
         * @returns An object of arrays of sample properties.
         */
        mockPropertyArray: function () {
            return {
                Creature: ["Pete", 249, 5],
                Starfish: ["Sammy", 15, 3],
                Rock: ["Tim", 22, 100]
            };
        }
    };

    return mocks;
});
