
Generate typeScript type definitions from JSON



# Feature
*  JSON to typescript
*  Loose json specification with automatic formatting error repair
*  Provides vscode and utools plugins, cli


# vscode
search for **JSON2DTS** install

![alt](https://github.com/zenotsai/image-hosting/blob/master/frontend/json2dts.gif?raw=true)



# Cli




## Usage

```js
// install
npm i json2dts-gen

// cli
js2dts -f ./package.json 

// or

import generateDeclarationFile, { parseJson } from 'json2dts-gen';
 const res = generateDeclarationFile(parseJson(value), {
          objectSeparate: true
          interfacePrefix: 'I' 
        }); 
```

## params

| param | describe | default |
| :-----| ----: | :----: |
| -c | json content | -- |
| -f |  file path | -- |
| -sep |  Object types are defined individually | true |
| -prefix |  ixinterface prefix | -- |







# UTools
search for **Json2Ts** install

![image](https://raw.githubusercontent.com/zenotsai/image-hosting/master/frontend/截屏2022-04-19-下午2.3wl5x8b292a0.webp)

## Test

```npm run test ```