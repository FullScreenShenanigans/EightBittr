declare module NumberMakr {
    export interface INumberMakrSettings {
        /**
         * A starting seed used to initialize. This can be a Number or Array; the
         * appropriate resetFrom Function will be called.
         */
        seed?: number | number[];

        /**
         * How long the state vector should be.
         */
        stateLength?: number;

        /**
         * How long the state period should be.
         */
        statePeriod?: number;

        /**
         * A constant mask to generate the matrixAMagic Array of [0, some number].
         */
        matrixA?: number;

        /**
         * An upper mask to binary-and on (the most significant w-r bits).
         */
        maskUpper?: number;

        /**
         * A lower mask to binary-and on (the least significant r-bits).
         */
        maskLower?: number;
    }

    export interface INumberMakr {
        getSeed(): number | number[];
        getStateLength(): number;
        getStatePeriod(): number;
        getMatrixA(): number;
        getMaskUpper(): number;
        getMaskLower(): number;
        resetFromSeed(seedNew?: number | number[]): void;
        resetFromArray(keyInitial: number[], keyLength?: number): void;
        randomInt32(): number;
        random(): number;
        randomInt31(): number;
        randomReal1(): number;
        randomReal3(): number;
        randomReal53Bit(): number;
        randomUnder(max: number): number;
        randomWithin(min: number, max: number): number;
        randomInt(max: number): number;
        randomIntWithin(min: number, max: number): number;
        randomBoolean(): boolean;
        randomBooleanProbability(probability: number): boolean;
        randomBooleanFraction(numerator: number, denominator: number): boolean;
        randomArrayIndex(array: any[]): number;
        randomArrayMember(array: any[]): any;
    }
}

module NumberMakr {
    "use strict";

    /**
     * An updated version of the traditional MersenneTwister JavaScript class by 
     * Sean McCullough (2010), based on code by Takuji Nishimura and Makoto 
     * Matsumoto (1997 - 2002).
     * 
     * For the 2010 code, see https://gist.github.com/banksean/300494.
     */
    /*
      I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
      so it's better encapsulated. Now you can have multiple random number generators
      and they won't stomp all over each other's state.
      
      If you want to use this as a substitute for Math.random(), use the random()
      method like so:
      
      var statePeriod = new MersenneTwister();
      var randomNumber = statePeriod.random();
      
      You can also call the other genrand_{foo}() methods on the instance.
    
      If you want to use a specific seed in order to get a repeatable random
      sequence, pass an integer into the constructor:
    
      var statePeriod = new MersenneTwister(123);
    
      and that will always produce the same random sequence.
    
      Sean McCullough (banksean@gmail.com)
    */
    /* 
       A C-program for MT19937, with initialization improved 2002/1/26.
       Coded by Takuji Nishimura and Makoto Matsumoto.
     
       Before using, initialize the state by using init_genrand(seed)  
       or init_by_array(keyInitial, keyLength).
     
       Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
       All rights reserved.                          
     
       Redistribution and use in source and binary forms, with or without
       modification, are permitted provided that the following conditions
       are met:
     
         1. Redistributions of source code must retain the above copyright
            notice, this list of conditions and the following disclaimer.
     
         2. Redistributions in binary form must reproduce the above copyright
            notice, this list of conditions and the following disclaimer in the
            documentation and/or other materials provided with the distribution.
     
         3. The names of its contributors may not be used to endorse or promote 
            products derived from this software without specific prior written 
            permission.
     
       THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
       "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
       LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
       A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER
       OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
       EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
       PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
       PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
       LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
       NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
       SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     
       Any feedback is very welcome.
       http://www.math.sci.hiroshima-u.ac.jp/~statePeriod-mat/stateVector/emt.html
       email: statePeriod-mat @ math.sci.hiroshima-u.ac.jp (remove space)
    */
    export class NumberMakr implements INumberMakr {
        /**
         * Length of the state vector.
         */
        private stateLength: number;

        /**
         * Period of the state vector.
         */
        private statePeriod: number;

        /**
         * Constant vector A.
         */
        private matrixA: number;

        /**
         * Constant magic Array from matrixA.
         */
        private matrixAMagic: number[];

        /**
         * Most significant w-r bits.
         */
        private maskUpper: number;

        /**
         * Least significant r bits.
         */
        private maskLower: number;

        /**
         * Past states.
         */
        private stateVector: number[];

        /**
         * Number for the place in stateVector (if out of range, uni
         */
        private stateIndex: number;

        /**
         * The starting seed used to initialize.
         */
        private seed: number | number[];

        /**
         * Resets the NumberMakr.
         * 
         * @constructor
         * @param {Number/Array} [seed]   A starting seed used to initialize. This 
         *                                can be a Number or Array; the appropriate
         *                                resetFrom Function will be called.
         * @param {Number} [stateLength]   How long the state vector will be.
         * @param {Number} [statePeriod]   How long the state period will be.
         * @param {Number} [matrixA]   A constant mask to generate the matrixAMagic
         *                             Array of [0, some number]
         * @param {Number} [maskUpper]   An upper mask to binary-and on (the most 
         *                               significant w-r bits).
         * @param {Number} [maskLower]   A lower mask to binary-and on (the least
         *                               significant r bits).
         */
        constructor(settings: INumberMakrSettings = {}) {
            this.stateLength = settings.stateLength || 624;
            this.statePeriod = settings.statePeriod || 397;
            this.matrixA = settings.matrixA || 0x9908b0df;
            this.maskUpper = settings.maskUpper || 0x80000000;
            this.maskLower = settings.maskLower || 0x7fffffff;

            this.stateVector = new Array(this.stateLength);
            this.stateIndex = this.stateLength + 1;
            this.matrixAMagic = new Array(0x0, this.matrixA);

            this.resetFromSeed(settings.seed || new Date().getTime());
        }


        /* Simple gets
        */

        /**
         * @return {Mixed} The starting seed used to initialize.
         */
        getSeed(): number | number[] {
            return this.seed;
        }

        /**
         * @return {Number} THe length of the state vector.
         */
        getStateLength(): number {
            return this.stateLength;
        }

        /**
         * @return {Number} THe length of the state vector.
         */
        getStatePeriod(): number {
            return this.statePeriod;
        }

        /**
         * @return {Number} THe length of the state vector.
         */
        getMatrixA(): number {
            return this.matrixA;
        }

        /**
         * @return {Number} THe length of the state vector.
         */
        getMaskUpper(): number {
            return this.maskUpper;
        }

        /**
         * @return {Number} THe length of the state vector.
         */
        getMaskLower(): number {
            return this.maskLower;
        }


        /* Resets
        */

        /**
         * Initializes state from a Number.
         * 
         * @param {Number} [seedNew]   Defaults to the previously set seed.
         */
        resetFromSeed(seedNew: number | number[] = 0): void {
            var s: number;

            this.stateVector[0] = <number>seedNew >>> 0;

            for (this.stateIndex = 1; this.stateIndex < this.stateLength; this.stateIndex += 1) {
                s = this.stateVector[this.stateIndex - 1] ^ (this.stateVector[this.stateIndex - 1] >>> 30);
                this.stateVector[this.stateIndex] = (
                    (((((s & 0xffff0000) >>> 16) * 1812433253) << 16)
                        + (s & 0x0000ffff) * 1812433253
                        ) + this.stateIndex
                    ) >>> 0;
            }

            this.seed = seedNew;
        }

        /**
         * Initializes state from an Array.
         * 
         * @param {Number[]} keyInitial
         * @param {Number} [keyLength]   The length of keyInitial (defaults to the
         *                                actual keyInitial.length).
         * @remarks   There was a slight change for C++, 2004/2/26.
         */
        resetFromArray(keyInitial: number[], keyLength: number = keyInitial.length): void {
            var i: number = 1,
                j: number = 0,
                k: number,
                s: number;

            this.resetFromSeed(19650218);

            if (typeof (keyLength) === "undefined") {
                keyLength = keyInitial.length;
            }

            k = this.stateLength > keyLength ? this.stateLength : keyLength;

            while (k > 0) {
                s = this.stateVector[i - 1] ^ (this.stateVector[i - 1] >>> 30);
                this.stateVector[i] = (this.stateVector[i] ^ (
                    ((((s & 0xffff0000) >>> 16) * 1664525) << 16)
                    + ((s & 0x0000ffff) * 1664525)
                    ) + keyInitial[j] + j
                    ) >>> 0;

                i += 1;
                j += 1;

                if (i >= this.stateLength) {
                    this.stateVector[0] = this.stateVector[this.stateLength - 1];
                    i = 1;
                }

                if (j >= keyLength) {
                    j = 0;
                }
            }

            for (k = this.stateLength - 1; k; k -= 1) {
                s = this.stateVector[i - 1] ^ (this.stateVector[i - 1] >>> 30);
                this.stateVector[i] = ((this.stateVector[i] ^ (
                    ((((s & 0xffff0000) >>> 16) * 1566083941) << 16)
                    + (s & 0x0000ffff) * 1566083941)
                    ) - i
                    ) >>> 0;

                i += 1;

                if (i >= this.stateLength) {
                    this.stateVector[0] = this.stateVector[this.stateLength - 1];
                    i = 1;
                }
            }

            this.stateVector[0] = 0x80000000;
            this.seed = keyInitial;
        }


        /* Random number generation
        */

        /**
         * @return {Number} Random Number in [0,0xffffffff].
         */
        randomInt32(): number {
            var y: number,
                kk: number;

            if (this.stateIndex >= this.stateLength) {
                if (this.stateIndex === this.stateLength + 1) {
                    this.resetFromSeed(5489);
                }

                for (kk = 0; kk < this.stateLength - this.statePeriod; kk += 1) {
                    y = (this.stateVector[kk] & this.maskUpper)
                    | (this.stateVector[kk + 1] & this.maskLower);

                    this.stateVector[kk] = this.stateVector[kk + this.statePeriod]
                    ^ (y >>> 1)
                    ^ this.matrixAMagic[y & 0x1];
                }

                for (; kk < this.stateLength - 1; kk += 1) {
                    y = (this.stateVector[kk] & this.maskUpper)
                    | (this.stateVector[kk + 1] & this.maskLower);

                    this.stateVector[kk] = this.stateVector[kk + (this.statePeriod - this.stateLength)]
                    ^ (y >>> 1)
                    ^ this.matrixAMagic[y & 0x1];
                }

                y = (this.stateVector[this.stateLength - 1] & this.maskUpper)
                | (this.stateVector[0] & this.maskLower);

                this.stateVector[this.stateLength - 1] = this.stateVector[this.statePeriod - 1]
                ^ (y >>> 1) ^ this.matrixAMagic[y & 0x1];

                this.stateIndex = 0;
            }

            y = this.stateVector[this.stateIndex];
            this.stateIndex += 1;

            y ^= (y >>> 11);
            y ^= (y << 7) & 0x9d2c5680;
            y ^= (y << 15) & 0xefc60000;
            y ^= (y >>> 18);

            return y >>> 0;
        }

        /**
         * @return {Number} Random number in [0,1).
         * @remarks Divided by 2^32.
         */
        random(): number {
            return this.randomInt32() * (1.0 / 4294967296.0);
        }

        /**
         * @return {Number} Random Number in [0,0x7fffffff].
         */
        randomInt31(): number {
            return this.randomInt32() >>> 1;
        }


        /* Real number generators (due to Isaku Wada, 2002/01/09)
        */

        /**
         * @return {Number} Random real Number in [0,1].
         * @remarks Divided by 2 ^ 32 - 1.
         */
        randomReal1(): number {
            return this.randomInt32() * (1.0 / 4294967295.0);
        }

        /**
         * @return {Number} Random real Number in (0,1).
         * @remarks Divided by 2 ^ 32.
         */
        randomReal3(): number {
            return (this.randomInt32() + 0.5) * (1.0 / 4294967296.0);
        }

        /**
         * @return {Number} Random real Number in [0,1) with 53-bit resolution.
         */
        randomReal53Bit(): number {
            var a: number = this.randomInt32() >>> 5,
                b: number = this.randomInt32() >>> 6;

            return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
        }


        /* Ranged Number generators
        */

        /**
         * @param {Number} max
         * @return {Number} Random Number in [0,max).
         */
        randomUnder(max: number): number {
            return this.random() * max;
        }

        /**
         * @param {Number} min
         * @param {Number} max
         * @return {Number} Random Number in [min,max).
         */
        randomWithin(min: number, max: number): number {
            return this.randomUnder(max - min) + min;
        }


        /* Ranged integer generators
        */

        /**
         * @param {Number} max
         * @return {Number} Random integer in [0,max).
         */
        randomInt(max: number): number {
            return this.randomUnder(max) | 0;
        }

        /**
         * @param {Number} min
         * @param {Number} max
         * @return {Number} Random integer in [min,max).
         */
        randomIntWithin(min: number, max: number): number {
            return (this.randomUnder(max - min) + min) | 0;
        }

        /**
         * @return {Boolean} Either true or false, with 50% probability of each.
         */
        randomBoolean(): boolean {
            return this.randomInt(2) === 1;
        }

        /**
         * @param {Number} probability   How likely the returned Boolean will be
         *                               true, in [0, 1]. Greater than 1 is counted
         *                               as 1.
         * 
         * @return {Boolean} Either true or false, with the probability of true 
         *                   equal to the given probability.
         */
        randomBooleanProbability(probability: number): boolean {
            return this.random() < probability;
        }

        /**
         * @param {Number} numerator   The numerator of a fraction. 
         * @param {Number} denominator   The denominator of a fraction.
         * @return {Boolean} Either true or false, with a probability equal to the
         *                   given fraction.
         */
        randomBooleanFraction(numerator: number, denominator: number): boolean {
            return this.random() <= (numerator / denominator);
        }

        /**
         * @param {Array} array
         * @return {Number} A random index, from 0 to the given Array's length
         */
        randomArrayIndex(array: any[]): number {
            return this.randomIntWithin(0, array.length);
        }

        /**
         * @param {Array} array
         * @return {Mixed} A random element from within the given Array.
         */
        randomArrayMember(array: any[]): any {
            return array[this.randomArrayIndex(array)];
        }
    }
}
