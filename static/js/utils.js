
function validateDate (d) {
  if (Object.prototype.toString.call(d) === '[object Date]') {
    if (isNaN(d.getTime())) {
      return false
    } else {
      return true
    }
  } else {
    return false
  }
}

export function parseDate (d) {
  if (validateDate(d)) return d

  var dd = new Date(d)
  if (validateDate(dd)) return dd

  dd = d.slice(0, -2).split(/[^0-9]/)
  d = new Date(Date.UTC(dd[0], dd[1] - 1, dd[2], dd[3], dd[4], dd[5]) - (dd[6] * 3600000))
  if (validateDate(d)) return d
  else throw ('invalid date', d)
}

export function dateToString (d, short) {
  var month = d.getUTCMonth() + 1
  var day = d.getUTCDate()
  var hour = d.getUTCHours() + ''
  if (hour.length === 1) hour = '0' + hour
  var minute = d.getUTCMinutes() + ''
  if (minute.length === 1) minute = '0' + minute

  var monthString = ''
  if (month === 1) monthString = 'January'
  if (month === 2) monthString = 'February'
  if (month === 3) monthString = 'March'
  if (month === 4) monthString = 'April'
  if (month === 5) monthString = 'May'
  if (month === 6) monthString = 'June'
  if (month === 7) monthString = 'July'
  if (month === 8) monthString = 'August'
  if (month === 9) monthString = 'September'
  if (month === 10) monthString = 'October'
  if (month === 11) monthString = 'November'
  if (month === 12) monthString = 'December'
  if (short) monthString = monthString.slice(0, 3)

  return monthString + ' ' + day + ', ' + hour + ':' + minute
}

export function lerp (start, end, ratio) {
  return start + (end - start) * ratio
}

export function rgb2hex (rgb) {
  return ((rgb[0] * 255 << 16) + (rgb[1] * 255 << 8) + rgb[2] * 255)
}