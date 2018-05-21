const ADDS = require('./')

const view = value => console.log(JSON.stringify(value, null, 2))

Promise.all([
  ADDS('metars', {
    stationString: 'KSEA',
    hoursBeforeNow: 1,
    mostRecentForEachStation: true
  }),
  ADDS('tafs', {
    stationString: 'KJFK',
    hoursBeforeNow: 1,
    mostRecentForEachStation: true
  }),
  ADDS('aircraftreports', {
    hoursBeforeNow: 1,
    mostRecent: true
  }),
  ADDS('airsigmets', {
    hoursBeforeNow: 6,
    mostRecent: true
  }),
  ADDS('gairmets', {
    hoursBeforeNow: 6,
    mostRecent: true
  }),
  ADDS('stations', {
    stationString: 'PANC'
  })
])
  .then(results => {
    view(results)
  })
