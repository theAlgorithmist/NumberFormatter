"use strict";
// Modified from code bearing the following copyright
Object.defineProperty(exports, "__esModule", { value: true });
/* copyright (c) 2012, Jim Armstrong.  All Rights Reserved.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * This software may be modified for commercial use as long as the above copyright notice remains intact.
 */
/**
 * Copyright 2017 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Typescript Math Toolkit: A set of utilities for formatting and displaying floating-piont values.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
var TSMT$NumberFormatter = (function () {
    function TSMT$NumberFormatter() {
    }
    /**
     * Round a floating-point number to nearest multiple
     *
     * @param : number - Number to be rounded
     *
     * @param : number - Round to nearest multiple of this value, i.e. nearest tenth is 0.1, nearest fifth is 0.2, and
     * nearest half is 0.5.  Use 10 to round to nearest 10, for example.
     *
     * @return number - Rounded input number to the specified number of digits unless the input Number is undefined or
     * the digits value is less than zero.  If the digits value is zero, the input number is returned.
     */
    TSMT$NumberFormatter.roundTo = function (value, round) {
        // error-checking
        if (isNaN(value) || !isFinite(value) || round < 0) {
            return 0;
        }
        // trivial cases
        if (round == 0) {
            return value;
        }
        if (round == 1.0) {
            return Math.round(value);
        }
        var r = Math.floor(1 / round);
        r = r == 0 ? 1.0 / round : r;
        return Math.round(value * r) / r;
    };
    /**
     * Return a String representation of an input number that is converted to fixed-point notation
     *
     * @param value : number - Input floating-point number
     *
     * @param decimal : number - (Integer) number of decimal places
     *
     * @return string - A string representation of the fixed-point number, i.e. 5.14162 is returned as "5.14" to two decimal places or
     * "NaN" if the input is not a number.  If the number of decimal places is zero, the number is truncated, i.e. 5.14162 as an input
     * results in the String output, "5".  This is functionally similar to the toFixed() method in most languages and is provided to allow
     * custom control over the formatting.
     */
    TSMT$NumberFormatter.toFixed = function (value, decimal) {
        // outliers
        if (isNaN(value) || !isFinite(value) || typeof value !== 'number') {
            // game over
            return TSMT$NumberFormatter.INVALID;
        }
        else if (decimal < 0) {
            // straight return
            return value.toString();
        }
        else {
            if (decimal == 0) {
                return value < 0 ? Math.ceil(value).toString() : Math.floor(value).toString();
            }
            else {
                decimal = Math.round(decimal);
                var isNegative = value < 0;
                value = Math.abs(value);
                // there's really nothing new under the sun ...
                var power = Math.pow(10, decimal);
                power = 1 / power;
                var temp = TSMT$NumberFormatter.roundTo(value, power);
                var str = temp.toString();
                var i = str.indexOf(".");
                if (i != -1) {
                    for (i = str.substr(i + 1).length; i < decimal; ++i) {
                        str += '0';
                    }
                }
                else {
                    str += ".";
                    for (i = 0; i < decimal; ++i) {
                        str += "0";
                    }
                }
                return isNegative ? '-' + str : str;
            }
        }
    };
    /**
     * Return the number of digits past the decimal point of a floating-point number
     *
     * @param value: number - input number, such as 3.762
     *
     * @return number - Number of decimal places, i.e. 0 if the input is actually an integer, 2 in the case of 4.15, and
     * 1 in the case of 3.5
     */
    TSMT$NumberFormatter.numdigitsPastDecimal = function (value) {
        if (isNaN(value) || !isFinite(value) || typeof value !== 'number') {
            return 0;
        }
        var val = value.toString();
        var index = val.indexOf(".");
        if (index == -1) {
            return 0;
        }
        return val.length - index - 1;
    };
    /**
     * Return the order magnitude of a floating-point number
     *
     * @param : number - Input, floating-point number
     *
     * @return number - Integer value, say k, such that the input number can be expressed as C*10^k, where C is a constant
     */
    TSMT$NumberFormatter.orderOfMagnitude = function (value) {
        // outliers
        if (isNaN(value) || !isFinite(value) || typeof value !== 'number') {
            return 0;
        }
        if (value == 0) {
            return 0;
        }
        // a bit silly, but should export okay to a wide variety of target environments
        var exponent = Math.floor(Math.log(Math.abs(value)) * TSMT$NumberFormatter.LOG_INVERSE);
        var powerOfTen = Math.pow(10, exponent);
        var mantissa = value / powerOfTen;
        // compute exponent
        exponent = mantissa == 10 ? exponent + 1 : exponent;
        return exponent;
    };
    /**
     * Return a formatted String that contains the input floating-point number converted to scientific notation
     *
     * @param value : Number - Input, floating-point number
     *
     * @param significantDigits : number - Number of significant digits, must be at least 1
     *
     * @return string - The number, 512.127, for example, is returned as "5.121 x 10^2" with three significant digits.  This string may be used
     * to format UI items that accept rich-text input and properly format superscript tags.  Returns "NaN" if the input is not a number.
     */
    TSMT$NumberFormatter.toScientific = function (value, significantDigits) {
        if (significantDigits === void 0) { significantDigits = 1; }
        if (isNaN(value) || !isFinite(value) || typeof value !== 'number') {
            return TSMT$NumberFormatter.INVALID;
            ;
        }
        if (value == 0) {
            return '0';
        }
        // this is clumsy but should work across all target environments
        var exponent = Math.floor(Math.log(Math.abs(value)) * TSMT$NumberFormatter.LOG_INVERSE);
        exponent = value == 0 ? 0 : exponent;
        var powerOfTen = Math.pow(10, exponent);
        var mantissa = value / powerOfTen;
        if (mantissa == 10) {
            mantissa = 1;
            exponent += 1;
        }
        var significand = TSMT$NumberFormatter.toFixed(mantissa, significantDigits);
        return significand + ' x 10^' + exponent.toString();
    };
    /**
     * Return the exponent of a floating-point number
     *
     * @param value : number - Input, floating-point number
     *
     * @return number - Exponent if the number were expressed in scientific notation or zero if the input is invalid
     *
     */
    TSMT$NumberFormatter.getExponent = function (value) {
        if (isNaN(value) || !isFinite(value) || typeof value !== 'number') {
            return 0;
        }
        if (Math.abs(value) < TSMT$NumberFormatter.TOL) {
            return 0;
        }
        value = Math.abs(value);
        var exponent = Math.floor(Math.log(Math.abs(value)) * TSMT$NumberFormatter.LOG_INVERSE);
        var powerOfTen = Math.pow(10, exponent);
        var mantissa = value / powerOfTen;
        // compute exponent
        exponent = mantissa == 10 ? exponent + 1 : exponent;
        return value == 0 ? 0 : exponent;
    };
    /**
     * Format a floating-point number into a String representation
     *
     * @param value : number - Input, floating-point number
     *
     * @param significantDigits : number - Number of significant digits after the decimal place - should be at least 1.
     * @default 1
     *
     * @param useSeparator : boolean - True if a comma is used to separate groups of three digits (defaults to false)
     *
     * @param scientificNotation : boolean -  True if scientific notation is to be used (this argument is only processed if 'useSeparator' is false)
     * @default false.
     *
     * @return string - Formatted number with the requested number of significant digits.  Note that 'useSeparator' and 'scientificNotation'
     * are mutually exclusive.  If 'useSeparator' is true, then groups of three digits are separated by commas.  If 'useSeparator' is false
     * and 'scientificNotation' is used, then the result is returned in scientific notation.  Returns "NaN" if the input is not a number.
     */
    TSMT$NumberFormatter.formatNumber = function (value, significantDigits, useSeparator, scientificNotation) {
        if (significantDigits === void 0) { significantDigits = 1; }
        if (useSeparator === void 0) { useSeparator = false; }
        if (scientificNotation === void 0) { scientificNotation = false; }
        if (isNaN(value) || !isFinite(value) || typeof value !== 'number') {
            return 'NaN';
        }
        var digits = significantDigits < 0 ? 1 : significantDigits;
        digits = Math.round(digits);
        // insert commas?
        if (useSeparator) {
            // adjust for significant digits
            var tmp = TSMT$NumberFormatter.toFixed(value, digits);
            return TSMT$NumberFormatter.insertCommas(+tmp);
        }
        else {
            // scientific or fixed notation
            return scientificNotation ? TSMT$NumberFormatter.toScientific(value, digits) : TSMT$NumberFormatter.toFixed(value, digits);
        }
    };
    /**
     * Insert commas between groups of three digits before the decimal place
     *
     * @param value: number Input number
     *
     * @returns string Formatted string with commas inserted between groups of three consecutive digits or 'NaN' if input
     * is invalid.  For example, 1234567 is formatted as 1,234,567 and 1367.88 is formatted as 1,367.88
     */
    TSMT$NumberFormatter.insertCommas = function (value) {
        if (isNaN(value) || !isFinite(value) || typeof value !== 'number') {
            return TSMT$NumberFormatter.INVALID;
        }
        if (Math.abs(value) < 1000) {
            return value.toString();
        }
        var isNegative = value < 0;
        if (isNegative) {
            value = Math.abs(value);
        }
        var theNumber = value.toString();
        var decimalPart = '';
        var decimal = theNumber.indexOf('.');
        if (decimal != -1) {
            decimalPart = theNumber.substring(decimal, theNumber.length);
            theNumber = theNumber.substring(0, decimal);
        }
        var withCommas = '';
        var len = theNumber.length;
        var i = 1;
        withCommas += theNumber.charAt(0);
        while (i < len) {
            if ((len - i) % 3 == 0)
                withCommas += ",";
            withCommas += theNumber.charAt(i);
            i++;
        }
        withCommas = decimal == -1 ? withCommas : withCommas + decimalPart;
        withCommas = isNegative ? '-' + withCommas : withCommas;
        return withCommas;
    };
    /**
     * Format a 7- or 10-digit string as a phone number, i.e. 'xxxyyyzzzz' is formatted as (xxx) yyy-zzzz
     *
     * @param value: string Digit sequence, i.e. '2141234567'.  Expected to contain only digits.
     *
     * @returns string Formatted phone number.  No test is currently made for input other than digits.
     */
    TSMT$NumberFormatter.toPhoneNumber = function (value) {
        if (value === undefined || value === '') {
            return this.DEFAULT_PHONE;
        }
        // get rid of selected characters in case partial formatting was present
        value = value.replace(/\-/g, '');
        value = value.replace(/\(/g, '');
        value = value.replace(/\)/g, '');
        value = value.replace(/\+/g, '');
        value = value.replace(/\*/g, '');
        var digits = value.length;
        if (digits !== 7 && digits != 10) {
            return this.DEFAULT_PHONE;
        }
        var area = digits == 7 ? '' : '(' + value.substr(0, 3) + ') ';
        var prefix = digits == 7 ? value.substr(0, 3) : value.substr(3, 3);
        var line = digits == 7 ? value.substr(3, 4) : value.substr(6, 4);
        return area + prefix + '-' + line;
    };
    return TSMT$NumberFormatter;
}());
TSMT$NumberFormatter.LOG_INVERSE = 1 / 2.30258509299; // 1/LN(10);
TSMT$NumberFormatter.DEFAULT_PHONE = 'no phone number';
TSMT$NumberFormatter.INVALID = "NaN";
TSMT$NumberFormatter.TOL = 0.000000001; // TODO make machine epsilon
exports.TSMT$NumberFormatter = TSMT$NumberFormatter;
