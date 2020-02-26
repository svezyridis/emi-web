export const objectToQueryString = obj =>
  '?' +
  Object.keys(obj)
    .map(key => key + '=' + obj[key])
    .join('&')

export const titleCase = str => {
  if (typeof str === 'string' || str instanceof String) {
    str = str.toLowerCase().split(' ')
    const final = []
    for (const word of str) {
      final.push(word.charAt(0).toUpperCase() + word.slice(1))
    }
    return final.join(' ')
  } else {
    return null
  }
}
