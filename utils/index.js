import moment from 'moment';

export const fuzzySearch = (pattern, string) =>
  fuzzyMatch(pattern, string) !== null;

export const fuzzyMatch = (pattern, string) => {
  pattern = convertVN(pattern || '');
  string = convertVN(string || '');
  let opts = {};
  var patternIdx = 0,
    result = [],
    len = string.length,
    totalScore = 0,
    currScore = 0,
    // prefix
    pre = opts.pre || '',
    // suffix
    post = opts.post || '',
    // String to compare against. This might be a lowercase version of the
    // raw string
    compareString = (opts.caseSensitive && string) || string.toLowerCase(),
    ch;

  pattern = (opts.caseSensitive && pattern) || pattern.toLowerCase();

  // For each character in the string, either add it to the result
  // or wrap in template if it's the next string in the pattern
  for (var idx = 0; idx < len; idx++) {
    ch = string[idx];
    if (compareString[idx] === pattern[patternIdx]) {
      ch = pre + ch + post;
      patternIdx += 1;

      // consecutive characters should increase the score more than linearly
      currScore += 1 + currScore;
    } else {
      currScore = 0;
    }
    totalScore += currScore;
    result[result.length] = ch;
  }

  // return rendered string if we have a match for every char
  if (patternIdx === pattern.length) {
    // if the string is an exact match with pattern, totalScore should be maxed
    totalScore = compareString === pattern ? Infinity : totalScore;
    return { rendered: result.join(''), score: totalScore };
  }

  return null;
};

export const convertVN = (str, withoutSpecChar = false) => {
  str = (str || '').toString().toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  if (withoutSpecChar) {
    return str;
  } else {
    return str.replace(/[^a-zA-Z0-9/, ]/g, '');
  }
};

export const formatDateTime = (time, full, format) => {
  let timeAndZone =
    typeof time === 'number' ? moment(time, 'X') : moment.utc(time);
  timeAndZone = timeAndZone.utcOffset(7);
  const datetime = moment(timeAndZone);
  if (full) return datetime.format('HH:mm DD/MM/YYYY');
  if (format) return datetime.format(format);
  return datetime.calendar(null, {
    sameDay: 'HH:mm',
    nextDay: `HH:mm [ngày mai]`,
    nextWeek: 'HH:mm DD/MM',
    lastDay: `HH:mm [hôm qua]`,
    lastWeek: 'HH:mm DD/MM',
    sameElse: function (now) {
      if (this.isSame(now, 'year')) return 'HH:mm DD/MM';
      return 'HH:mm DD/MM/YYYY';
    }
  });
};

export const getLangFromCountryCode = (countryCode) => {
  switch (countryCode) {
    case '84':
      return 'vi';
    case '62':
      return 'id';
    default:
      return 'en';
  }
};

export const getMobileOperatingSystem = () => {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  }

  if (/android/i.test(userAgent)) {
    return 'Android';
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }

  return 'unknown';
};

export const intCurrencyList = ['VND', 'TWD', 'LAK', 'PHP', 'MMK', 'JPY'];
export const currencyPrefixList = ['TWD', 'USD', 'JPY', 'PHP'];
export const xctCurrencyList = ['IDR', 'KRW']; // Danh sách không hiển thị phần thập phân nếu là 00
export const dotList = ['USD', 'TWD', 'JPY', 'PHP', 'THB', 'MYR'];

export const getFloatChar = currency => (dotList.includes(currency) ? '.' : ',');

export const formatNumber = (value, currency = 'VND', prefix = true) => {
  const floatChar = getFloatChar(currency);
  value = value ? value.toString() : '0';
  if (value.includes(floatChar) && value.indexOf(floatChar) > value.length - 3) return value;
  let minusChar = parseInt(value) < 0 ? '-' : '';
  let amount = Math.abs(parseInt(value)) || 0;
  amount = amount
    ? !intCurrencyList.includes(currency) && typeof currency != 'undefined' && currency
      ? `${Math.floor(amount / 100)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${floatChar == '.' ? ',' : '.'}`)}${Math.abs(amount) % 100
          ? prefix
            ? floatChar + (Math.abs(amount) % 100 > 9 ? Math.abs(amount) % 100 : '0' + (Math.abs(amount) % 100))
            : floatChar +
            ((Math.abs(amount) % 100) % 10
              ? Math.abs(amount) % 100 > 9
                ? Math.abs(amount) % 100
                : '0' + (Math.abs(amount) % 100)
              : Math.floor((Math.abs(amount) % 100) / 10))
          : prefix && !xctCurrencyList.includes(currency)
            ? `${floatChar}00`
            : ''
      }`
      : amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${floatChar == '.' ? ',' : '.'}`)
    : amount;
  if (typeof currency != 'undefined' && prefix)
    return currencyPrefixList.includes(currency)
      ? 'đ' + ' ' + minusChar + amount
      : minusChar + amount + ' ' + 'đ';
  else return minusChar + amount;
};
