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
