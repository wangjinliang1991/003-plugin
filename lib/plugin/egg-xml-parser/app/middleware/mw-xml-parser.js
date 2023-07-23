const parse = require('co-body')
const { xml2js } = require('xml-js')

module.exports = options => {
  const xmlTypes = options.xmlTypes;

  return async function xmlParser(ctx, next) {
    try {
      const res = await parseBody(ctx)
      ctx.request.body = 'parsed' in res ? res.parsed : {}
      if (ctx.request.rawBody === undefined) {
        ctx.request.rawBody = res.raw;
      }
    } catch (err) {
      ctx.logger.warn(err)
    }

    await next()
  }

  async function parseBody(ctx) {
    if (ctx.request.is(xmlTypes)) {
      var body = await parse.text(ctx.request)
      ctx.logger.info(body)
      const xmlContent = xml2js(body)
      return {
        raw: body,
        parsed: xmlContent.elements[0]
      }
    }

    return {}
  }
}