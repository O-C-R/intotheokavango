
export function loadBeacon (expedition, day) {
  return {
    type: 'LOAD-BEACON',
    expedition,
    day
  }
}

export function requestBeacon (expedition, day) {
  return {
    type: 'REQUEST-BEACON',
    expedition,
    day
  }
}

export function receiveBeacon (expedition, day, json) {
  return {
    type: 'RECEIVE-BEACON',
    expedition,
    day,
    features: json.results,
    receivedAt: Date.now()
  }
}

export function errorBeacon (expedition, day, error) {
  return {
    type: 'ERROR-BEACON',
    expedition,
    day,
    error: error,
    receivedAt: Date.now()
  }
}
