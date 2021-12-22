/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2017 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import { Component } from 'react';
import awsdk from 'awsdk';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

class Util extends Component {
  constructor() {
    super();
    dayjs.extend(customParseFormat);
  }
}

export function getLanguage(locale) {
  const arr = locale.split('_');
  let language = '';
  if (arr) {
    language = arr[0];
  } else {
    language = locale; // locale is the language
  }
  return language;
}

export function getCountry(locale) {
  const arr = locale.split('_');
  let country = '';
  if (arr) {
    country = arr[1];
  } else {
    country = ''; // no country defined
  }
  return country;
}

export function isValidEmail(email) {
  return email.match('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$');
}

export function isValidUrl(url) {
  return url.match(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i);
}

export function isValidPhoneNumber(phone) {
  return phone.match('^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$');
}

/**
 * This function checks if a date string is of the 'mm/dd/yy' format.
 * @param {string} dateAsString the date string to validate.
 */
export function isValidInputDate(dateAsString) {
  return /(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(\d{2})/.test(dateAsString);
}

/**
 * This function checks if a time string is of the 'hh:mm am/pm' format.
 * @param {string} timeAsString the time string to validate.
 */
export function isValidInputTime(timeAsString) {
  return /^(1[0-2]|0?[1-9]):([0-5]?[0-9])(?:(\s)[AaPp][Mm])$/.test(timeAsString);
}

/**
 * This function checks if a US zip code is valid
 * @param {string} zipCode the zipCode to validate.
 */
export function isValidZipCode(zipCode) {
  return /^[0-9]{5}(-[0-9]{4})?$/.test(zipCode);
}

/**
 * Validate a date passed as an object with year, month and day as properties
 * @param {*} date the date to validate
 * @param {Bool} partialDateIsValid return true or false if the date is a partial date
 * @param {Bool} allowFutureDate if future dates are allowed
 */
export function isValidDate(date, partialDateIsValid, allowFutureDate) {
  let year = null;
  let month = null;
  let day = null;
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getUTCMonth() + 1;
  if (date.year !== '') {
    const minYear = currentYear - 120;
    year = Number(date.year);
    if (Number.isNaN(year) || year < minYear) {
      return false;
    }
    if (year > currentYear && !allowFutureDate) {
      return false;
    }
  }
  if (date.month !== '' && date.month !== '0') {
    month = Number(date.month);
    if (Number.isNaN(month) || month > 12 || month < 1) {
      return false;
    }
    if (year === currentYear && month > currentMonth && !allowFutureDate) {
      return false;
    }
  }
  if (date.day !== '') {
    day = Number(date.day);
    const currentDay = today.getUTCDate();
    // day 0 is last day of month
    const maxDay = (new Date(Date.UTC(year, month, 0))).getUTCDate();
    if (Number.isNaN(day) || day > maxDay || day < 1) {
      return false;
    }
    if (year === currentYear && month === currentMonth && day > currentDay && !allowFutureDate) {
      return false;
    }
  }
  if (year === null || month === null || day === null) {
    return partialDateIsValid;
  }

  return true;
}

// Note: This function serves as a fallback mechanism when the consumer's full name isn't supplied by the American Well telehealth platform.
export function composeFullName(consumer, middleNameHandlingOption, direction) {
  let middleNameOrInitial = null;
  if (middleNameHandlingOption && middleNameHandlingOption === awsdk.AWSDKConsumerMiddleNameHandling.INITIAL) {
    middleNameOrInitial = consumer.middleInitial ? `${consumer.middleInitial}.` : null;
  } else if (middleNameHandlingOption && middleNameHandlingOption === awsdk.AWSDKConsumerMiddleNameHandling.FULLNAME) {
    middleNameOrInitial = consumer.middleName;
  }
  if (direction === 'rtl') {
    return middleNameOrInitial ? `${consumer.lastName} ${middleNameOrInitial} ${consumer.firstName}` :
      `${consumer.lastName} ${consumer.firstName}`;
  }
  return middleNameOrInitial ? `${consumer.firstName} ${middleNameOrInitial} ${consumer.lastName}` :
    `${consumer.firstName} ${consumer.lastName}`;
}
// a direction aware name concatenator
export function concatNames(firstName, lastName, middleName, separator, direction) {
  const sep = separator || ' ';
  const res = [];
  if (middleName) res.push(middleName);
  if (direction !== 'rtl') {
    res.unshift(firstName);
    res.push(lastName);
  } else {
    res.unshift(lastName);
    res.push(firstName);
  }
  return res.join(sep);
}
/**
 * This function truncates a string, if needed, to the maximum number of characters allowed ending in ellipsis (...), if it's length
 * is longer than 3, to provide a visual cue to the user that the string has been truncated.
 * Sample usage:
 * textToDisplay: 'Juan Sanchez Villa-Lobos Ramirez', maxLen: 15, returns: 'Juan Sanchez...'
 * @param {string} textToDisplay the text we wish to truncate for display
 * @param {number} [maxLen] a non-negative integer that determines the maximum length that the textToDisplay should have
 */
export function truncateForDisplay(textToDisplay, maxLen) {
  Number.isInteger = Number.isInteger || (value => typeof value === 'number' && isFinite(value) && Math.floor(value) === value); // polyfill for IE
  if (typeof textToDisplay !== 'string' || !Number.isInteger(maxLen) || maxLen < 0 || maxLen >= textToDisplay.length) {
    return textToDisplay;
  }
  if (maxLen <= 3) { // don't add ellipsis if 3 or less chars
    return textToDisplay.substring(0, maxLen);
  }
  return textToDisplay.substring(0, maxLen - 3).concat('...');
}

export function loadPdfFile(blob, name) {
  const pdfBlob = new Blob([blob], { type: 'application/pdf' });
  // for IE: can't use blob as href in link
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(pdfBlob);
    return;
  }
  // for other browsers
  const url = window.URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.pdf`;
  document.body.appendChild(link);
  link.click();
  // for Firefox delay revoking the url slightly
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);
}

export function openBlob(blob) {
  const isMicrosoftBrowser = window.navigator && window.navigator.msSaveOrOpenBlob;
  const theWindow = !isMicrosoftBrowser ? window.open('') : null;
  if (isMicrosoftBrowser) {
    window.navigator.msSaveOrOpenBlob(blob);
  } else {
    theWindow.location = URL.createObjectURL(blob);
  }
}

export function areEqualStrings(string1, string2, ignoreCase = true) {
  let flags = 'g';
  if (ignoreCase) flags += 'i';
  const pattern = new RegExp('^'.concat(string1, '$'), flags);
  return pattern.test(string2);
}

/**
 * This function checks if a string is null, undefined or empty, and returns true if null, undefined or empty, false otherwise.
 * A zero length or whitespace only string is considered to be an empty string
 * @param {string} text the text to check if it's unset, empty or not.
 */
export function isUnsetOrEmptyString(text) {
  return (!text || text.trim() === '');
}

/**
 * This function checks if a value is null, undefined, not an array, or an empty array.
 * It returns true if the value is null, undefined, not an array or an empty array, false otherwise.
 * @param {Array} value the value to check if it's unset, empty or not.
 */
export function isUnsetOrEmptyArray(value) {
  return (!Array.isArray(value) || value.length === 0);
}

/**
 * This function returns the current date in ISO or non-ISO format.
 * @param {String} format the ISO or non-ISO format to return the current date as.
 */
export function getCurrentDate(format) {
  return dayjs(new Date()).format(format);
}

/**
 * This function returns the current time in ISO or non-ISO format.
 * @param {String} format the ISO or non-ISO format to return the current time as.
 */
export function getCurrentTime(format) {
  return dayjs(new Date()).format(format);
}

/**
 * This function returns a valid JavaScript Date from an ISO or non-ISO formatted date and time.
 * @param {String} dateTimeAsString the date and time string value.
 * @param {String} inputFormat the ISO or non-ISO format of dateTimeAsString.
 */
export function parseInputDateTime(dateTimeAsString, inputFormat) {
  return dayjs(dateTimeAsString, inputFormat).toDate();
}

/**
 * This function returns an ISO or non-ISO formatted date and time in the past.
 * @param {Number} timeValue the time value in the past such as 90 days ago.
 * @param {String} timeUnit the unit of time such as days, year, month.
 * @param {String} format the ISO or non-ISO format to return the previous date and time as.
 */
export function getPastDateTime(timeValue, timeUnit, format) {
  return dayjs(new Date()).subtract(timeValue, timeUnit).format(format);
}

/**
  * @private
  */
function hasActiveConsumerChanged(currentProps, prevProps) {
  return currentProps.activeConsumer.id.persistentId !== prevProps.activeConsumer.id.persistentId;
}

/**
 * @private
 *
 */
function hasLocaleChanged(currentProps, prevProps) {
  return currentProps.locale !== prevProps.locale;
}
/**
 * This function checks whether the active consumer or the locale have changed between property
 * updates. It returns a boolean true if there's been a change in either the active consumer or the
 * locale, and false otherwise.
 * @param {Object} currentProps the current set of properties available to the component
 * @param {Object} prevProps the previous set of properties that were available to the component
 */
export function hasContextChanged(currentProps, prevProps) {
  return hasActiveConsumerChanged(currentProps, prevProps) || hasLocaleChanged(currentProps, prevProps);
}

export function shouldUseWebRTC(visitOrParticipant) {
  return awsdk.utils.WebRTCHelper.isWebRTCSupported() && visitOrParticipant.isUsingWebRTC;
}

/**
 * Takes an unformatted or partially formatted string of numbers and returns a formatted
 * or partially formatted phone number string for display.
 *
 * @param {String} input the string to format
 * @returns {String} Returns a formatted or partially formatted phone number
 */
export function formatPhoneNumber(input) {
  const phoneDigits = input.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  return !phoneDigits[2] ? phoneDigits[1] : '(' + phoneDigits[1] + ') ' + phoneDigits[2] + (phoneDigits[3] ? '-' + phoneDigits[3] : '');
}

export default Util;
