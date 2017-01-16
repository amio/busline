const axios = require('axios')
const { send } = require('micro')
const { parse } = require('url')

module.exports = async function (req, res) {
  const { query, pathname } = parse(req.url, true)

  let result = { err: 'Unknown request.' }
  switch (pathname) {
    case '/state':
      result = await fetchBuslineState(query.city, query.line)
      break
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  send(res, 200, result)
}

function fetchBuslineState (city, line) {
  const endpoint = 'http://xxbs.sh.gov.cn:8080/weixinpage/HandlerTwo.ashx'
  const url = `${endpoint}?name=${line}%E8%B7%AF&lineid=0${line}00`
  return axios.get(url)
  .then(r => r.data)
  .catch(e => {
    return { msg: `No info for line: ${line}` }
  })
}
