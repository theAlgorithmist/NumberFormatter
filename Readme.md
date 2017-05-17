# Typescript Math Toolkit Number Formatter

I have previously released a preliminary version of the number formatter as part of a couple Angular 2 demos, however, that was an incomplete port of code that was previously authored in C++ and Actionscript.

This is the formal alpha release of the Typescript Math Toolkit Number Formatter, a class that facilitates formatting and display of numerical data.  It is particularly useful in the creastion of custom Angular pipes.

Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Typescript: 2.3.2

Version: 1.0


## Installation

Installation involves all the usual suspects

  - npm and gulp installed globally
  - Clone the repository
  - npm install
  - get coffee (this is the most important step)


### Building and running the tests

1. gulp compile

2. gulp test

The test suite is in Mocha/Chai and specs reside in the _test_ folder.


### TSMT$Number Formatter

The _TSMT$NumberFormatter_ class consists of several _static_ methods that perform a formatting operations on numeric data or provide information that can be used in other custom formatting.

```
roundTo(value: number, round: number): number
toFixed(value: number, decimal: number): string
numdigitsPastDecimal(value: number): number
orderOfMagnitude(value: number): number
toScientific(value: number, significantDigits: number=1): string
getExponent(value: number): number
formatNumber(value: number, significantDigits: number=1, useSeparator: boolean=false, scientificNotation: boolean=false): string
insertCommas(value: number): string
toPhoneNumber(value: string): string

```

### Usage

All methods of the _TSMT$NumberFormatter_ class are static and are typically used as follows

```
const formatted: string = TSMT$NumberFormatter.formatNumber(1256789.4567, 4, false, true);

const scientific: string = TSMT$NumberFormatter.toScientific(512.127, 3);
```


Refer to the specs in the _test_ folder for more usage examples.


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[The Algorithmist]: <http://algorithmist.net>

