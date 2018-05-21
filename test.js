/* global describe, it */

const fs = require('fs')
const nock = require('nock')
const assert = require('chai').assert
const ADDS = require('./')

const fixtures = {
  metar: fs.readFileSync('./fixtures/metar.xml').toString(),
  taf: fs.readFileSync('./fixtures/taf.xml').toString(),
  aircraftReport: fs.readFileSync('./fixtures/aircraft-report.xml').toString(),
  airsigmet: fs.readFileSync('./fixtures/airsigmet.xml').toString(),
  gairmet: fs.readFileSync('./fixtures/gairmet.xml').toString(),
  station: fs.readFileSync('./fixtures/station.xml').toString()
}

describe('ADDS', () => {
  it('should exist', done => {
    assert(ADDS !== undefined)
    done()
  })

  describe('Parsing', () => {
    it('should parse metars correctly', async () => {
      nock(ADDS.ADDS_BASE_URI)
        .get('/adds/dataserver_current/httpparam')
        .query({ requestType: 'retrieve', format: 'xml', dataSource: 'metars' })
        .reply(200, fixtures.metar)

      return ADDS('metars', {})
        .then(results => {
          assert.equal(results.length, 1)
          assert.equal(results[0].station_id, 'KDEN')
          assert.equal(results[0].sky_condition.sky_cover, 'OVC')
        })
    })

    it('should parse tafs correctly', async () => {
      nock(ADDS.ADDS_BASE_URI)
        .get('/adds/dataserver_current/httpparam')
        .query({ requestType: 'retrieve', format: 'xml', dataSource: 'tafs' })
        .reply(200, fixtures.taf)

      return ADDS('tafs', {})
        .then(results => {
          assert.equal(results.length, 1)
          assert.equal(results[0].station_id, 'PHNL')
          assert.equal(results[0].forecast.length, 3)
          assert.equal(results[0].forecast[0].wind_speed_kt, 17)
        })
    })

    it('should parse aircraft reports correctly', async () => {
      nock(ADDS.ADDS_BASE_URI)
        .get('/adds/dataserver_current/httpparam')
        .query({ requestType: 'retrieve', format: 'xml', dataSource: 'aircraftreports' })
        .reply(200, fixtures.aircraftReport)

      return ADDS('aircraftreports', {})
        .then(results => {
          assert.equal(results.length, 1)
          assert.equal(results[0].aircraft_ref, 'ETD76T')
          assert.equal(results[0].wind_speed_kt, 126)
          assert.equal(results[0].report_type, 'AIREP')
        })
    })

    it('should parse airsigmets correctly', async () => {
      nock(ADDS.ADDS_BASE_URI)
        .get('/adds/dataserver_current/httpparam')
        .query({ requestType: 'retrieve', format: 'xml', dataSource: 'airsigmets' })
        .reply(200, fixtures.airsigmet)

      return ADDS('airsigmets', {})
        .then(results => {
          assert.equal(results.length, 1)
          assert.equal(results[0].airsigmet_type, 'AIRMET')
          assert.equal(results[0].area.point.length, 8)
          assert.equal(results[0].area.point[0].longitude, -108.93)
        })
    })

    it('should parse gairmets correctly', async () => {
      nock(ADDS.ADDS_BASE_URI)
        .get('/adds/dataserver_current/httpparam')
        .query({ requestType: 'retrieve', format: 'xml', dataSource: 'gairmets' })
        .reply(200, fixtures.gairmet)

      return ADDS('gairmets', {})
        .then(results => {
          assert.equal(results.length, 2)
          assert.equal(results[0].status, 'NRML')
          assert.equal(results[0].area.point.length, 17)
          assert.equal(results[0].area.point[0].longitude, -125.55)
        })
    })

    it('should parse stations correctly', async () => {
      nock(ADDS.ADDS_BASE_URI)
        .get('/adds/dataserver_current/httpparam')
        .query({ requestType: 'retrieve', format: 'xml', dataSource: 'stations' })
        .reply(200, fixtures.station)

      return ADDS('stations', {})
        .then(results => {
          assert.equal(results.length, 3)
          assert.equal(results[0].station_id, 'KDEN')
          assert.equal(results[0].longitude, -104.65)
          assert.deepEqual(results[0].site_type.METAR, {})
        })
    })
  })
})
