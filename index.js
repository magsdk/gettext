/**
 * Gettext loader and wrapper for magcore projects.
 *
 * @license The MIT License (MIT)
 * @copyright Igor Zaporozhets <i.zaporozhets@infomir.com>
 */

/* eslint no-path-concat: 0 */

'use strict';

var Emitter = require('cjs-emitter'),
    Gettext = require('cjs-gettext'),

    instance = new Emitter();


if ( DEVELOP ) {
    instance._ = instance.gettext = instance.pgettext = instance.ngettext = function () {
        throw new Error(__filename + ': you cannot use this function before mag-gettext not yet loaded');
    };
}


/**
 * Wrap the given data with gettext instance
 * and export methods to the global scope.
 *
 * @param {Object} [data] localization data
 * @private
 */
function prepare ( data ) {
    var gettext = new Gettext(data);

    instance._ = instance.gettext = gettext.gettext;
    instance.pgettext = gettext.pgettext;
    instance.ngettext = gettext.ngettext;
}


/**
 * Default application language
 */
instance.defaultLanguage = 'en';


/**
 * Load json localization.
 *
 * @param {Object} config options
 * @param {string} [config.path=lang] relative path to project root
 * @param {string} config.name language name
 * @param {string} [config.ext=json] language file extension
 * @param {string} [config.async=true] relative path to project root
 * @param {function} [callback] hook on ready
 */
instance.load = function ( config, callback ) {
    var xhr;

    if ( DEVELOP ) {
        if ( !config.name || typeof config.name !== 'string' ) {
            throw new Error(__filename + ': config.name must be a nonempty string');
        }
        if ( callback && typeof callback !== 'function' ) {
            throw new Error(__filename + ': wrong callback type');
        }
    }

    // defaults
    callback = callback || null;
    config.ext  = config.ext  || 'json';
    config.path = config.path || 'lang';
    config.async = config.async || true;


    // is it necessary to request a localization file?
    if ( config.name === instance.defaultLanguage ) {
        // no
        prepare();

        if ( callback !== null ) {
            callback();
        }

        // there are some listeners
        if ( instance.events['load'] ) {
            // notify listeners
            instance.emit('load');
        }
    } else {
        // yes
        xhr = new XMLHttpRequest();

        xhr.onload = function () {
            var jsonParseError, json;

            try {
                json = JSON.parse(xhr.responseText);
            } catch ( error ) {
                jsonParseError = error;
            }

            if ( jsonParseError ) {
                xhr.onerror(jsonParseError);
            } else {
                prepare(json);

                if ( callback !== null ) {
                    callback();
                }

                // there are some listeners
                if ( instance.events['load'] ) {
                    // notify listeners
                    instance.emit('load');
                }
            }
        };

        xhr.ontimeout = xhr.onerror = function ( error ) {
            if ( callback !== null ) {
                callback(error);
            }

            // there are some listeners
            if ( instance.events['error'] ) {
                // notify listeners
                instance.emit('error', error);
            }
        };

        xhr.open('GET', config.path + '/' + config.name + '.' + config.ext, config.async);
        xhr.send();
    }
};


// public
module.exports = instance;
