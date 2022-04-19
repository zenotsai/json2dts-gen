
Generate typeScript type definitions from JSON



# Installation
```npm i json2dts-gen```


# Usage

## cli

```js2dts -f ./package.json ```
 
### params

| param | describe | default |
| :-----| ----: | :----: |
| -c | json content | -- |
| -f |  file path | -- |
| -sep |  Object types are defined individually | true |
| -prefix |  ixinterface prefix | -- |


## code

```ts
import generateDeclarationFile, { parseJson } from 'json2dts-gen';
 const res = generateDeclarationFile(parseJson(value), {
          objectSeparate: true
          interfacePrefix: 'I' 
        }); 
```



为了方便使用，开发了 utools 插件，可在插件中搜索 Json2Ts 安装

![image](https://raw.githubusercontent.com/zenotsai/image-hosting/master/frontend/截屏2022-04-19-下午2.3wl5x8b292a0.webp)

## Test

```npm run test ```