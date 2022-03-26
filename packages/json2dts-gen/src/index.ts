import type { ObjectType, InterfaceDeclaration, ArrayTypeReference, PrimitiveType } from 'dts-dom';
import * as dtsDom from 'dts-dom';
import camelcase from 'camelcase';



export type IOptions = {
  objectSeparate?: boolean;
}


export function parseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch (e: any) {
    return new Function(`return ${value}`)();
  }
}




function generateDeclarationFile(value: object, options: IOptions = Object.create(null)): string[] {
  const { objectSeparate = true } = options;
  const intf = dtsDom.create.interface("CustomType");
  const standaloneType: InterfaceDeclaration[] = [];

  function getTypeOfValue(value: any, propertyKey?: string): ObjectType | InterfaceDeclaration | PrimitiveType | ArrayTypeReference {
    const type = typeof value;

    if (Array.isArray(value)) {
      if (value.length > 0) return dtsDom.create.array(getTypeOfValue(value[0], propertyKey));
      return dtsDom.create.array(dtsDom.type.any);
    }
    switch (type) {
      case "string":
      case "number":
      case "boolean":
        return type;
      case "undefined":
        return dtsDom.type.any;
      case "object":
        const keys = getObjectKeys(value);
        const members = keys.map((key: string) => {
          return dtsDom.create.property(key, getTypeOfValue(value[key], key));
        });
        if (!propertyKey) {
          const objType = dtsDom.create.objectType(members);
          return objType;
        }

        if (objectSeparate) {
          const interfaceName = camelcase(propertyKey, { pascalCase: true, preserveConsecutiveUppercase: true });

          const inter = dtsDom.create.interface(interfaceName);
          inter.members = members;
          standaloneType.push(inter);
          return inter;
        }
        const objType = dtsDom.create.objectType(members);
        return objType;

      default:
        return dtsDom.type.any;
    }
  }


  if (typeof value === "object") {
    const obj = getTypeOfValue(value) as InterfaceDeclaration;
    obj.members.forEach((m) => intf.members.push(m));
    const result = [];
    standaloneType.forEach((e) =>
      result.push(handlerResult(dtsDom.emit(e, { rootFlags: dtsDom.ContextFlags.Module })))
    );
    result.push(handlerResult(dtsDom.emit(intf, { rootFlags: dtsDom.ContextFlags.Module })))
    return result;
  }
  return [];
}


function handlerResult(res: string) {
  return res.replace(/\((.+)\)\[\]/g, "$1")
}
function getObjectKeys(value: object) {
  const names = Object.getOwnPropertyNames(value);
  return names;
}

export default generateDeclarationFile;