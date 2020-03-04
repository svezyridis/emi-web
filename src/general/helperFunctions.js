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

const sortByDate = (a, b) => new Date(b).valueOf() - new Date(a).valueOf()

const getDayForEvent = event => {
  const date = new Date(event.time)
  date.setMilliseconds(0)
  date.setSeconds(0)
  date.setMinutes(0)
  date.setHours(0)
  return date.toISOString()
}

export const groupByDay = events => {
  const groups = events.reduce((days, event) => {
    const day = getDayForEvent(event)
    if (!days[day]) {
      days[day] = []
    }
    days[day] = days[day].concat(event)
    return days
  }, {})
  return {
    days: Object.keys(groups).sort(sortByDate),
    notesByDay: groups
  }
}
