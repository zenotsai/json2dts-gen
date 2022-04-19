import { parseJson } from "../dist/index.js";
describe("parseLooseJson", () => {
  it("Nested Object", () => {
    expect(
      parseJson(`
        name:"jordan"
        sons: {
          "j1": 1
          "j2": 2
        }
      `)
    ).toEqual({
      name: "jordan",
      sons: {
        j1: 1,
        j2: 2,
      },
    });
  });
  it("Array", () => {
    expect(
      parseJson(`
       [
         "aaa"
       ]
      `)
    ).toEqual(["aaa"]);
  });
  it("Object", () => {
    expect(
      parseJson(`
        name:"jordan"
        age: 123
      `)
    ).toEqual({
      name: "jordan",
      age: 123,
    });
  });
});
