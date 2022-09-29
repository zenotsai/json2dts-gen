import generateDeclaration from "../dist/index.js";
describe("dts-gen", () => {
  it("Simple Object", () => {

    expect(
      generateDeclaration(`{
        name: "jordan",
      }`)
    ).toEqual('interface CustomType {\r\n    name: string;\r\n}\r\n\r\n')
  })

  it("property camelcase", () => {
    expect(
      generateDeclaration(`{
        my-key: "jordan"
      }`, {
        propertyKeyCamelcase: true
      })
    ).toEqual('interface CustomType {\r\n    myKey: string;\r\n}\r\n\r\n')
  })


  it("Array", () => {
    expect(
      generateDeclaration((`[
        "aaa"
      ]`))
    ).toEqual('type CustomType = string[]\r\n\r\n')
  })

  it("Array Object", () => {
    expect(
      generateDeclaration((`[
        {
          "age": 123,
          "name": "jordan"
        }
      ]`))
    ).toEqual('type CustomType = {\r\n    age: number;\r\n    name: string;\r\n}[]\r\n\r\n')
  })

  it("Nested Object", () => {
    expect(
      generateDeclaration((`{
        name: "jordan",
        info: {
          age: 123,
          gender: 'man'
        }
      }`), {
        objectSeparate: false
      })
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
