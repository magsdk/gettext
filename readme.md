MAG SDK localization
====================

This localization module is an instance of [Emitter](https://github.com/cjssdk/emitter) module.
Contains localization messages data used by other modules and provides methods to requests these messages.


## Installation ##

```bash
npm install mag-gettext
```


## Usage ##

Load localization messages file (`./lang/ru.json`):

```js
require('mag-gettext').load({name: 'ru'}, function ( error ) {
    console.log(error);
});
```

Then use inner function to use gettext functionality. Simple example:

```js
var gettext = require('mag-gettext').gettext;

console.log(gettext('some line to be localized'));
```

Also can be used as short alias:

```js
var _ = require('mag-gettext').gettext;

console.log(_('some line to be localized'));
```

Fetch a particular translation of the textual message:

```js
var pgettext = require('mag-gettext').pgettext;

console.log(pgettext('some context', 'some text'));
```

Native language translation of a textual message whose grammatical form depends on a number:

```js
var ngettext = require('mag-gettext').ngettext;

console.log(ngettext('{0} cat', '{0} cats', 1));
```

It's also possible to listen to instance events (`load` and `error`):

```js
require('mag-gettext').addListener('load', function () {
    // handle localization loading
});

require('mag-gettext').addListener('error', function () {
    // handle localization loading
});
```

On localization loading for `en` language real AJAX request is not executed.
There is `wrapper.defaultLanguage` option to control this behaviour.


## Development mode ##

> There is a global var `DEVELOP` which activates additional consistency checks and protection logic not available in release mode.


## Contribution ##

If you have any problem or suggestion please open an issue [here](https://gitlab.infomir.com.ua/web/magsdk/gettext/issues).
Pull requests are welcomed with respect to the [JavaScript Code Style](https://github.com/DarkPark/jscs).


## License ##

`mag-gettext` is released under the [MIT License](license.md).