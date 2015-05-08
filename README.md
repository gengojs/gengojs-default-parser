# gengojs-default-parser

The default parser plugin for gengo.js.

This module will be used for [gengo.js](https://github.com/iwatakeshi/gengojs).

An example usage with options is:

```js

var gengo = require('gengojs');
var parser = require('gengojs-default-parser');

/* In whatever framework you are using: */

// I'll use express for an example
// but it shouldn't matter

var app = require('express')();
app.use(gengo({
   // Specify the type
   // of option to modify
	parser:{
		/* options */
	}
},/*parser()*/));
```
The default parser is already included in gengojs so you should not have to require it.


## Options

```js
{
  // Specify the type of parser to use:
  // default, format, * (all)
  'type': 'default',
  // Markdown options
  'markdown': {
  	// Enable markdown
    'enabled': false,
    // From options 'html' to 'quotes'
    // see https://github.com/markdown-it/markdown-it
    'html': false,
    'xhtmlOut': false,
    'breaks': false,
    'langPrefix': 'language-',
    'linkify': false,
    'typographer': false,
    'quotes': '“”‘’'
  },
  // Interpolation options
  'template': {
  	// Enable Interpolate
    'enabled': true,
    // Openings
    'open': '{{',
    // Closings
    'close': '}}'
  },
  // Sprintf options
  'sprintf': {
    // Enable Sprintf
    'enabled': true
  },
  // Dictionary options
  'keywords': {
	  	// Default key used in dictionary
	  	// when your page is loaded in the
	  	// default language.
    'default': 'default',
    // Translated key used in dictionary
  	// when your page is loaded in a
  	// language other than your default.
    'translated': 'translated',
    // Global key used in dictionary
  	// across views.
    'global': 'global'
  },
  // Overriding options
  'overrides': {
  	// Override the filter
    'filter': null,
    // Engine class functions
    'engine': {
      // Override the default
      // parser function
      'default': null,
      // Override the format
      // parser function
      'format': null,
      // Override the find function
      'find': null
    }
  }
```
## Internal API

`result` returns the i18ned string.

**Example**:

```js
// Context
this.result;
```
## Dependencies

* `getLocale(locale:String)` from class `Header`
* `setLocale(locale:String)` from class `Header`
* `toDot()` from class `Router`
* `toArray()` from class `Router`
* `isEnabled()` from class `Router`

## Overriding the Parser

The default parser allows you to override many functions that
make up the parser. The following are the functions that you
can override:

* `filter`
  * This filters the input by separating the arguments
  into arrays and objects such as `keywords`, `templates`, and
  `arguments`. Keywords are for dictionary and templates are for
  interpolation. Arguments are for Sprintf. Since the parser does
  not support the pluralization for the default parser, it instead
  allows you to override the filter to your liking (ie. adding plural
  as keyword).
* `default`
  * This is the default parser that manages interpolation
  and sprintf.
* `format`
  * This is the format parser for message formatting.
* `find`
  * This searches the data for the translated or default key.
  It is here where you can add your own logic to support
  plurality.

For examples, check out the [GitHub page](https://github.com/iwatakeshi/gengojs-default-parser/tree/master/lib/class).

## Selecting a Parser

There are two types of parsers in gengojs-default-parser. The first is the default parser
which handles Sprintf and Interpolation, and the second is format which handles
[MessageFormat](https://github.com/yahoo/intl-messageformat).

By default, the first is your primary parser and can be changed in the options. You may also specify the type to use
when you use the [API](https://github.com/iwatakeshi/gengojs-default-api). To do so, see the following example:

```js
// Using default parser:
__('Hello', {parser:'default'});
// Using format parser:
__('You have {n, plural, =0 {no photos.}=1 {one photo.}other {# photos.}}', {parser:'format'});
```

## Debug

Unix:

```bash
DEBUG=default-backend
```
Windows:

```bash
SET DEBUG=default-backend
```
