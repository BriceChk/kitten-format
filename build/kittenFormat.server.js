'use strict';

var locales = {
  'default' : {
    locale       : 'fr-FR',
    currency     : 'EUR',
    precision    : 2,
    unitPrefixes : {
      '15' : 'P',
      '12' : 'T',
      '9'  : 'G',
      '6'  : 'M',
      '3'  : 'k',
      '0'  : '',
      '-3' : 'm',
      '-6' : 'μ',
      '-9' : 'n'
    }
  }
};

/**
 * Set default options
 * @param {Object} optionsValue
 */
function setOptions (optionsValue) {
  locales['default'] = optionsValue;
}

/**
 * Set locales to load
 * @param {Array} locales
 */
function setLocales (localesValue) {
  if (!localesValue.length) {
    return;
  }

  // First given locale is the default one
  setOptions(localesValue[0]);

  for (var i = 1; i < localesValue.length; i++) {
    locales[localesValue[i].locale] = localesValue[i];
  }
}

/**
 * Get the given locale or fallback to the default one
 * @param {String} locale
 */
function getLocale (locale) {
  if (!locales[locale]) {
    return locales['default'];
  }

  return locales[locale];
}

/**
 * Fixed decimal part to precision
 * @param {Number} value
 * @param {Int} precision
 * @returns {Number}
 */

var registerdFormatters = {};

/**
 * Get formatter instance
 * @param {String} locale ex: 'fr-FR'
 * @param {String} currency ex: 'EUR'
 * @param {Int} precision ex: 2
 * @returns {Intl}
 */
function getFormatter (locale, precision) {
  var _key = locale + ':' + precision;
  if (!registerdFormatters[_key]) {
    registerdFormatters[_key] = new Intl.NumberFormat(locale, {
      maximumFractionDigits : precision
    });
  }

  return registerdFormatters[_key];
}

/**
 * Format number
 * @param {Number} value
 * @param {Object} options
 * @return {String}
 */
function formatN (value, options) {
  if (value === undefined || value === null) {
    return value
  }

  options = options || {};

  var _localeOptions = getLocale(options.locale);
  var _precision     = options.precision || _localeOptions.precision;
  var _locale        = options.locale    || _localeOptions.locale;

  return getFormatter(_locale, _precision).format(value);
}

/**
 * Average a number
 * @param {Number} value
 * @param {Object} options
 * @returns {String}
 */
function averageN (value, options) {
  if (value === undefined || value === null) {
    return value;
  }

  options = options || {};

  var _power = options.power === null || options.power === undefined ? 0 : options.power;
  var _unit  = options.unit;

  if (!_unit) {
    return value;
  }

  var _valueStr     = (value + '').split('.')[0];
  var _valueLength  = _valueStr.length;
  var _averagePower = Math.trunc(_valueLength / 4) * 4;

  if (_averagePower !== 0) {
    _averagePower--;
  }

  var _localeOptions = getLocale(options.locale);
  var _unitPrefixes  = _localeOptions.unitPrefixes;
  var _value         = value * Math.pow(10, -_averagePower);
  var _result        = formatN(_value, options);

  return _result + ' ' + _unitPrefixes[_averagePower + _power] + _unit;
}

/*
  var _sourcePower = options.sourcePower || 0;
  var _targetPower = options.targetPower || 0;
  var _sourceUnit  = options.unit;

  if (!_sourceUnit) {
    return value;
  }

  var _localeOptions = getLocale(options.locale);
  var _converters    = _localeOptions.converters;
  var _power         = Math.pow(10, Math.abs(_sourcePower) - _targetPower);
  var _value         = _power < 0 || _sourcePower < 0 ? (value / _power) : (value * _power);
  var _result        = formatN(_value, options);
  return _result + ' ' + _converters[_targetPower] + _sourceUnit;
*/

/**
 * Lower case a string
 * @param {String} value
 * @returns {String}
 */
function lowerCase (value) {
  if (value === null || value === undefined || typeof value !== 'string') {
    return value;
  }

  return value.toLowerCase();
}

/**
 * Upper case a string
 * @param {String} value
 * @returns {String}
 */
function upperCase (value) {
  if (value === null || value === undefined || typeof value !== 'string') {
    return value;
  }

  return value.toUpperCase();
}


/**
 * Upper case first character of a string
 * @param {String} value
 * @returns {String}
 */
function upperCaseFirstChar (value) {
  if (value === null || value === undefined || typeof value !== 'string' || !value.length) {
    return value;
  }

  return value[0].toUpperCase() + lowerCase(value.slice(1, value.length));
}

var kittenFormat = {};

kittenFormat.setOptions = setOptions;
kittenFormat.setLocales = setLocales;

kittenFormat.averageN      = averageN;
kittenFormat.averageNumber = averageN;

kittenFormat.lowerCase          = lowerCase;
kittenFormat.upperCase          = upperCase;
kittenFormat.upperCaseFirstChar = upperCaseFirstChar;

module.exports = kittenFormat;
