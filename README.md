# 003-plugin

plugin的部分，https://www.bilibili.com/video/BV1k3411z7Np


## csrf
还是和002一样

在apifox中暂时无法获取csrf
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

但是还是报错403，暂时无法解决，还是和002一样

```js
config.security = {
    csrf: {
        enable: false,
    },
};
```

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

