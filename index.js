const axios = require('axios')
const qs = require('querystring')
const { send } = require('micro')
const { parse } = require('url')

module.exports = async function (req, res) {
  const { query, pathname } = parse(req.url, true)
  const { line, stop, direction } = query

  let result = { err: 'Unknown request.' }
  switch (pathname) {
    case '/sh/line':
      result = await fetchSHBuslineStops(line)
      break
    case '/sh/stop':
      result = await fetchSHBuslineStopState(line, direction, stop)
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  send(res, 200, result)
}

function fetchSHBuslineStops (lineid) {
  const endpoint = 'http://xxbs.sh.gov.cn:8080/weixinpage/HandlerTwo.ashx'
  const querystring = qs.stringify({
    name: lineid + '路',
    lineid: `0${lineid}00`
  })

  return axios.get(endpoint + '?' + querystring)
  .then(r => r.data, e => ({ msg: `No info for line: ${lineid}` }))
}

function fetchSHBuslineStopState (lineid, direction, stopid) {
  const endpoint = 'http://xxbs.sh.gov.cn:8080/weixinpage/HandlerThree.ashx'
  const querystring = qs.stringify({
    name: lineid + '路',
    lineid: `0${lineid}00`,
    direction: direction,
    stopid: stopid
  })
  return axios.get(endpoint + '?' + querystring)
  .then(r => r.data, e => ({ msg: `No result.` }))
}
