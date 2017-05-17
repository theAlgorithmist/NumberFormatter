/** Copyright 2017 Jim Armstrong (www.algorithmist.net)
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

// Specs for TSMT Number Formatter
import {TSMT$NumberFormatter} from '../src/NumberFormatter';

import * as Chai from 'chai';
const expect = Chai.expect;

// Test Suites
describe('TSMT Number Formatter (phone number)', () => {

  it('empty string produces default phone', function() {
    expect(TSMT$NumberFormatter.toPhoneNumber('')).to.equal('no phone number');
  });

  it('properly formats numbers with selected non-digit characters', function() {
    expect(TSMT$NumberFormatter.toPhoneNumber('123-456-7890')).to.equal('(123) 456-7890');
    expect(TSMT$NumberFormatter.toPhoneNumber('(123)456-7890')).to.equal('(123) 456-7890');
    expect(TSMT$NumberFormatter.toPhoneNumber('+1234567890')).to.equal('(123) 456-7890');
  });

  it('incorrect digits produces default phone', function() {
    expect(TSMT$NumberFormatter.toPhoneNumber('123')).to.equal('no phone number');
    expect(TSMT$NumberFormatter.toPhoneNumber('123456')).to.equal('no phone number');
    expect(TSMT$NumberFormatter.toPhoneNumber('12345678911')).to.equal('no phone number');
  });

  it('correctly formats 7-digit number', function() {
    expect(TSMT$NumberFormatter.toPhoneNumber('1234567')).to.equal('123-4567');
  });

  it('correctly formats 10-digit number', function() {
    expect(TSMT$NumberFormatter.toPhoneNumber('1234567890')).to.equal('(123) 456-7890');
  });
});

describe('TSMT Number Formatter (round to)', () =>
{
  it('zero returned on invalid input', function ()
  {
    let input: any = NaN;
    expect(TSMT$NumberFormatter.roundTo(input, 0.1)).to.equal(0);

    expect(TSMT$NumberFormatter.roundTo(1.25, -0.1)).to.equal(0);
  });

  it('returns input number when argument is zero', function ()
  {
    let input: number = 10.5;
    expect(TSMT$NumberFormatter.roundTo(input, 0)).to.equal(10.5);
  });

  it('equivalent to Math.round when argument is one', function ()
  {
    let input: number   = 10.5;
    let rounded: number = Math.round(input);
    expect(TSMT$NumberFormatter.roundTo(input, 1)).to.equal(rounded);

    input   = 0.2;
    rounded = Math.round(input);
    expect(TSMT$NumberFormatter.roundTo(input, 1)).to.equal(rounded);

    input   = -1.2;
    rounded = Math.round(input);
    expect(TSMT$NumberFormatter.roundTo(input, 1)).to.equal(rounded);

    input   = -10.5;
    rounded = Math.round(input);
    expect(TSMT$NumberFormatter.roundTo(input, 1)).to.equal(rounded);
  });

  it('correctly rounds to nearest tenth and hundredth', function ()
  {
    let input: number = 10.48;
    expect(TSMT$NumberFormatter.roundTo(input, 0.1)).to.equal(10.5);

    input = 0.128;
    expect(TSMT$NumberFormatter.roundTo(input, 0.1)).to.equal(0.1);

    input = 10.481;
    expect(TSMT$NumberFormatter.roundTo(input, 0.01)).to.equal(10.48);

    input = 0.128;
    expect(TSMT$NumberFormatter.roundTo(input, 0.01)).to.equal(0.13);
  });

  it('correctly rounds to nearest ten and hundred', function ()
  {
    let input: number = 10.48;
    expect(TSMT$NumberFormatter.roundTo(input, 10)).to.equal(10);

    input = 128;
    expect(TSMT$NumberFormatter.roundTo(input, 10)).to.equal(130);

    input = 10481;
    expect(TSMT$NumberFormatter.roundTo(input, 100)).to.equal(10500);

    input = 128;
    expect(TSMT$NumberFormatter.roundTo(input, 100)).to.equal(100);
  });
});

describe('TSMT Number Formatter (to fixed)', () =>
{
  it('(string) NaN returned on invalid input', function ()
  {
    let input: any = NaN;
    expect(TSMT$NumberFormatter.toFixed(input, 1)).to.equal('NaN');

    input = 'a';
    expect(TSMT$NumberFormatter.toFixed(input, 1)).to.equal('NaN');
  });

  it('Returns original input if number decimals is negative ', function ()
  {
    expect(TSMT$NumberFormatter.toFixed(10.5, -1)).to.equal('10.5');
  });

  it('returns floor/ceil if number of decimals is zero', function ()
  {
    expect(TSMT$NumberFormatter.toFixed(10.5, 0)).to.equal('10');
    expect(TSMT$NumberFormatter.toFixed(0.245, 0)).to.equal('0');
    expect(TSMT$NumberFormatter.toFixed(-1.5, 0)).to.equal('-1');
  });

  it('returns proper result to one digit', function ()
  {
    expect(TSMT$NumberFormatter.toFixed(10.54, 1)).to.equal('10.5');
    expect(TSMT$NumberFormatter.toFixed(0.245, 1)).to.equal('0.2');
    expect(TSMT$NumberFormatter.toFixed(-1.45, 1)).to.equal('-1.5');
    expect(TSMT$NumberFormatter.toFixed(-1.5, 1)).to.equal('-1.5');
  });

  it('returns proper result to two digit', function ()
  {
    expect(TSMT$NumberFormatter.toFixed(10.546, 2)).to.equal('10.55');
    expect(TSMT$NumberFormatter.toFixed(0.245, 2)).to.equal('0.25');
    expect(TSMT$NumberFormatter.toFixed(-1.577, 2)).to.equal('-1.58');
  });

  it('returns proper result to four digit', function ()
  {
    expect(TSMT$NumberFormatter.toFixed(1256789.4567, 4)).to.equal('1256789.4567');
  });
});

describe('TSMT Number Formatter (# digits past decimal)', () =>
{
  it('returns zero if input is invalid', function ()
  {
    let input: any = NaN;
    expect(TSMT$NumberFormatter.numdigitsPastDecimal(input)).to.equal(0);

    input = 'a';
    expect(TSMT$NumberFormatter.numdigitsPastDecimal(input)).to.equal(0);
  });

  it('returns zero if the input has no decimal point', function ()
  {
    expect(TSMT$NumberFormatter.numdigitsPastDecimal(10)).to.equal(0);
    expect(TSMT$NumberFormatter.numdigitsPastDecimal(-5)).to.equal(0);
  });

  it('returns correct result for arbitrary numbers with fixed number of decimal places', function ()
  {
    expect(TSMT$NumberFormatter.numdigitsPastDecimal(10.0)).to.equal(0);
    expect(TSMT$NumberFormatter.numdigitsPastDecimal(10.1)).to.equal(1);
    expect(TSMT$NumberFormatter.numdigitsPastDecimal(0.12)).to.equal(2);
    expect(TSMT$NumberFormatter.numdigitsPastDecimal(-10.7071)).to.equal(4);
  });
});

describe('TSMT Number Formatter (order of magnitude)', () =>
{
  it('returns zero if input is invalid', function ()
  {
    let input: any = NaN;
    expect(TSMT$NumberFormatter.orderOfMagnitude(input)).to.equal(0);

    input = 'a';
    expect(TSMT$NumberFormatter.orderOfMagnitude(input)).to.equal(0);
  });

  it('returns -1 if |x| > 0 && |x| < 1', function ()
  {
    expect(TSMT$NumberFormatter.orderOfMagnitude(0.5)).to.equal(-1);
    expect(TSMT$NumberFormatter.orderOfMagnitude(-0.2)).to.equal(-1);
  });

  it('returns 0 if |x| > 1 && |x| < 10', function ()
  {
    expect(TSMT$NumberFormatter.orderOfMagnitude(5.72)).to.equal(0);
    expect(TSMT$NumberFormatter.orderOfMagnitude(-2.1)).to.equal(0);
  });

  it('returns 1 if |x| > 10 && |x| < 100', function ()
  {
    expect(TSMT$NumberFormatter.orderOfMagnitude(10.5)).to.equal(1);
    expect(TSMT$NumberFormatter.orderOfMagnitude(50.72)).to.equal(1);
    expect(TSMT$NumberFormatter.orderOfMagnitude(99.0)).to.equal(1);
    expect(TSMT$NumberFormatter.orderOfMagnitude(-21.1)).to.equal(1);
  });

  it('returns 2 if |x| > 100 && |x| < 1000', function ()
  {
    expect(TSMT$NumberFormatter.orderOfMagnitude(100.5)).to.equal(2);
    expect(TSMT$NumberFormatter.orderOfMagnitude(500.72)).to.equal(2);
    expect(TSMT$NumberFormatter.orderOfMagnitude(999.0)).to.equal(2);
    expect(TSMT$NumberFormatter.orderOfMagnitude(-210.1)).to.equal(2);
  });
});

describe('TSMT Number Formatter (scientific notation)', () =>
{
  it('returns zero if input is invalid', function ()
  {
    let input: any = NaN;
    expect(TSMT$NumberFormatter.toScientific(input, 1)).to.equal('NaN');

    input = 'a';
    expect(TSMT$NumberFormatter.toScientific(input, 1)).to.equal('NaN');
  });

  it('returns (string) zero if value is exactly zero', function ()
  {
    expect(TSMT$NumberFormatter.toScientific(0.0, 1)).to.equal('0');
  });

  it('returns proper results across combinations of value and number significant digits', function ()
  {
    expect(TSMT$NumberFormatter.toScientific(1.0, 1)).to.equal('1.0 x 10^0');
    expect(TSMT$NumberFormatter.toScientific(2.1, 1)).to.equal('2.1 x 10^0');
    expect(TSMT$NumberFormatter.toScientific(0.95, 2)).to.equal('9.50 x 10^-1');
    expect(TSMT$NumberFormatter.toScientific(512.127, 3)).to.equal('5.121 x 10^2');
  });
});

describe('TSMT Number Formatter (insert commas)', () =>
{
  it('returns (string) NaN if input is invalid', function ()
  {
    let input: any = NaN;
    expect(TSMT$NumberFormatter.insertCommas(input)).to.equal('NaN');

    input = 'a';
    expect(TSMT$NumberFormatter.toScientific(input)).to.equal('NaN');
  });

  it('returns input number (to string) if magnitude < 1000', function ()
  {
    expect(TSMT$NumberFormatter.insertCommas(999)).to.equal('999');
    expect(TSMT$NumberFormatter.insertCommas(0.457)).to.equal('0.457');
    expect(TSMT$NumberFormatter.insertCommas(-800)).to.equal('-800');
  });

  it('correctly inserts commas for various numbers with magnitude > 1000', function ()
  {
    expect(TSMT$NumberFormatter.insertCommas(1000)).to.equal('1,000');
    expect(TSMT$NumberFormatter.insertCommas(1023045.457)).to.equal('1,023,045.457');
    expect(TSMT$NumberFormatter.insertCommas(-800752)).to.equal('-800,752');
  });
});

describe('TSMT Number Formatter (general formatter)', () =>
{
  it('returns (string) NaN if input is invalid', function ()
  {
    let input: any = NaN;
    expect(TSMT$NumberFormatter.formatNumber(input, 1)).to.equal('NaN');

    input = 'a';
    expect(TSMT$NumberFormatter.formatNumber(input, 1)).to.equal('NaN');
  });

  it('uses at least one significant digit even if that input is not passed or is invalid', function ()
  {
    expect(TSMT$NumberFormatter.formatNumber(1.45)).to.equal('1.5');
    expect(TSMT$NumberFormatter.formatNumber(-1.45)).to.equal('-1.5');

    expect(TSMT$NumberFormatter.formatNumber(1.45, -1)).to.equal('1.5');
    expect(TSMT$NumberFormatter.formatNumber(1.45, 1.67)).to.equal('1.45');
  });

  it('properly formats requested number of significant digits', function ()
  {
    expect(TSMT$NumberFormatter.formatNumber(1.45, 2)).to.equal('1.45');
    expect(TSMT$NumberFormatter.formatNumber(-1.45, 2)).to.equal('-1.45');

    expect(TSMT$NumberFormatter.formatNumber(12.4567, 3)).to.equal('12.457');
    expect(TSMT$NumberFormatter.formatNumber(12.4567, 4)).to.equal('12.4567');
  });

  it('properly formats with a requested separator', function ()
  {
    expect(TSMT$NumberFormatter.formatNumber(1.45, 2, true)).to.equal('1.45');
    expect(TSMT$NumberFormatter.formatNumber(1203.4567, 3, true)).to.equal('1,203.457');
    expect(TSMT$NumberFormatter.formatNumber(1256789.4567, 4, true)).to.equal('1,256,789.4567');
  });

  it('properly formats with scientific notation', function ()
  {
    expect(TSMT$NumberFormatter.formatNumber(1.45, 2, false, true)).to.equal('1.45 x 10^0');
    expect(TSMT$NumberFormatter.formatNumber(1203.4567, 3, false, true)).to.equal('1.203 x 10^3');
    expect(TSMT$NumberFormatter.formatNumber(1256789.4567, 4, false, true)).to.equal('1.2568 x 10^6');
  });
});

describe('TSMT Number Formatter (get exponent)', () =>
{
  it('returns zero if input is invalid', function ()
  {
    let input: any = NaN;
    expect(TSMT$NumberFormatter.getExponent(input)).to.equal(0);

    input = 'a';
    expect(TSMT$NumberFormatter.getExponent(input)).to.equal(0);
  });

  it('returns -1 for input of 0.5', function ()
  {
    expect(TSMT$NumberFormatter.getExponent(0.5)).to.equal(-1);
  });

  it('returns 0 for input of exactly or near zero', function ()
  {
    expect(TSMT$NumberFormatter.getExponent(0)).to.equal(0);
    expect(TSMT$NumberFormatter.getExponent(0.0000000001)).to.equal(0);
  });

  it('returns zero for |x| > 0 && |x| < 10', function ()
  {
    expect(TSMT$NumberFormatter.getExponent(1.47)).to.equal(0);
    expect(TSMT$NumberFormatter.getExponent(-9.2)).to.equal(0);
  });

  it('returns 1 for |x| > 10 && |x| < 100', function ()
  {
    expect(TSMT$NumberFormatter.getExponent(11.47)).to.equal(1);
    expect(TSMT$NumberFormatter.getExponent(-92.2)).to.equal(1);
  });

  it('returns 2 for |x| > 100 && |x| < 1000', function ()
  {
    expect(TSMT$NumberFormatter.getExponent(411.47)).to.equal(2);
    expect(TSMT$NumberFormatter.getExponent(-902.2)).to.equal(2);
  });
});
