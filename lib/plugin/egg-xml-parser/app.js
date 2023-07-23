const assert = require('assert')

module.exports = app => {
  //将xmlparser放到 bodyParser 之前
  const index = app.config.coreMiddleware.indexOf('bodyParser')
  assert(index >= 0, 'bodyParser 中间件必须存在')
  app.config.coreMiddleware.splice(index,0,'mwXmlParser')
}