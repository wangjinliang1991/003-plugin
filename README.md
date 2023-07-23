# 003-plugin

plugin的部分，https://www.bilibili.com/video/BV1k3411z7Np

## 开发
router.js

```js
router.post('/api/echo', controller.home.echo);
```

home.js

```js
ctx.body = {
    type: ctx.get('content-type'),
    body,
}
```



### apifox请求

```
POST /api/echo
```

body 为raw

```
<note to='larry' from='selby' heading='Reminder'>
Don't forget the meeting!
</note>
```



#### csrf的处理

apifox通过后置脚本和header处理

后置脚本

```js
var csrf_token= pm.cookies.get("csrfToken")
console.log(pm.response);
pm.globals.unset("csrftoken")
pm.globals.set("csrftoken",csrf_token)
```

header

```
Content-Type: text/x-xml
csrf_token:{{csrftoken}}
```

但是还是报错403，暂时无法解决，先不纠结，和002的处理一样，

```js
config.security = {
    csrf: {
        enable: false,
    },
};
```



### debug

修改launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Egg Dev",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run",
        "debug",
        "--",
        "--inspect-brk"
      ],
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "auto",
      "port": 7001,
      "autoAttachChildProcesses": true,
      "request": "launch",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node"
    }
  ]
}
```



### 插件的渐进式开发

lib目录定义插件目录 lib\plugin\egg-xml-parser

#### package.json

```json
{
  "name": "egg-xml-parser",
  "eggPlugin": {
    "name": "xmlParser",
    "version": "1.0.0"
  }
}
```

#### app.js

```js
const assert = require('assert')

module.exports = app => {
  //将xmlparser放到 bodyParser 之前
  const index = app.config.coreMiddleware.indexOf('bodyParser')
  assert(index >= 0, 'bodyParser 中间件必须存在')
  app.config.coreMiddleware.splice(index,0,'mwXmlParser')
}
```

#### config/config.default.js

定义配置参数

```js
exports.mwXmlParser = {
  xmlTypes: [
    'text/x-xml',
    'application/x-xml'
  ]
}
```



#### 在项目的plugin.js定义来源

```js
const path = require('path');

exports.xmlParser = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-xml-parser'),
};
```

#### 之后就是中间件的业务逻辑

app/middleware/mw-xml-parser.js

```js
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
```

由于使用中间件，需要禁用原来的bodyParser

项目的config.default.js

```js
config.bodyParser = {
    enable: false,
  };
```



后续正式发布，需要将plugin.js的path改为package，名字改为package的名字

参考 https://www.eggjs.org/zh-CN/basics/plugin

## debug调试
和视频中不太一样
launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Egg Dev",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run",
        "debug",
        "--",
        "--inspect-brk"
      ],
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "auto",
      "port": 7001,
      "autoAttachChildProcesses": true,
      "request": "launch",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node"
    }
  ]
}
```