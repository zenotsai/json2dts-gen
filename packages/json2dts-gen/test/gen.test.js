import generateDeclaration, { parseJson } from "../dist/index.js";
describe("dts-gen", () => {
  it("Simple Object", () => {
    expect(
      generateDeclaration(parseJson(`{
        name: "jordan"
      }`))[0]
    ).toEqual('interface CustomType {\r\n    name: string;\r\n}\r\n\r\n')
  })


  it("Array", () => {
    expect(
      generateDeclaration(parseJson(`[
        "aaa"
      ]`))[0]
    ).toEqual('type CustomType = string[]\r\n\r\n')
  })

  it("Array Object", () => {
    expect(
      generateDeclaration(parseJson(`[
        {
          "age": 123,
          "name": "jordan"
        }
      ]`))[0]
    ).toEqual('type CustomType = {\r\n    age: number;\r\n    name: string;\r\n}[]\r\n\r\n')
  })

  it("Nested Object", () => {
    expect(
      generateDeclaration(parseJson(`{
        name: "jordan",
        info: {
          age: 123,
          gender: 'man'
        }
      }`), {
        objectSeparate: false
      })[0]
    ).toEqual('interface CustomType {\r\n' +
    '    name: string;\r\n' +
    '    info: {\r\n' +
    '        age: number;\r\n' +
    '        gender: string;\r\n' +
    '    };\r\n' +
    '}\r\n' +
    '\r\n')
  })
});
