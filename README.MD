
Generate typeScript type definitions from JSON



# Feature
*  JSON to typescript
*  Loose json specification with automatic formatting error repair
*  Provides vscode and utools plugins, cli


# vscode
search for **JSON2DTS** install

![alt](https://github.com/zenotsai/image-hosting/blob/master/frontend/json2dts.gif?raw=true)



# Cli

```js
// install
npm i json2dts-gen

// cli
js2dts -f ./package.json 

// or

import generateDeclaration  from 'json2dts-gen';
const value = `{
  "name": "vscode"
}`
 const res = generateDeclaration(value, {
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
| -prefix |  interface prefix | -- |
| -camelcase |  property camelcase | -- |







# UTools
search for **Json2Ts** install

## Test

```npm run test ```