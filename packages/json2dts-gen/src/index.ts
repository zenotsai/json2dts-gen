import type { ObjectType, InterfaceDeclaration, ArrayTypeReference, PrimitiveType } from './dts-dom';
import * as dtsDom from './dts-dom';
// @ts-ignore
import jsonFixerBrowser from 'json-fixer-browser';
import camelcase from 'camelcase';


export type IOptions = {
  objectSeparate?: boolean;
  interfacePrefix?: string;
}

function jsonFixer(value: string) {
  try {
    const { data } = jsonFixerBrowser(value);
    return data;
  } catch (e) {
    console.error(e)
  }
  return undefined
}


/**
 * TODO: 在 json-fixer 中拓展
 * @param value 
 * @returns 
 */
function jsonFixerObject(value: string) {
  if (!/^{.+}$/.test(value)) {
    try {
      const parts = value.split(/\n/).filter(item => Boolean(item.trim())).map((item) => {
        const res = item.trim();
        if (res.endsWith(',') || res.endsWith('{')) {
          return res;
        }
        return res + ','
      })
      const newValue = `{${parts.join('')}}`
      return new Function(`return ${newValue}`)();
    } catch (e) {
      console.error(e)
    }
  }
  return undefined
}
function looseParseJson(value: string): object {
  let result;

  try {
    result = new Function(`return ${value}`)();
  } catch (e) {
    result = jsonFixer(value);
  }
  if (!result) {
    result = jsonFixerObject(value)
  }
  return result;
}

export function parseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch (e: any) {
    return looseParseJson(value);
  }
}




function generateDeclarationFile(value: object, options: IOptions = Object.create(null)): string[] {
  const { objectSeparate = true, interfacePrefix = '' } = options;
  const intf = dtsDom.create.interface(generateInterfaceName("CustomType"));
  const standaloneType: InterfaceDeclaration[] = [];
  const result: string[] = [];
  function generateInterfaceName(name: string) {
    return interfacePrefix + name;
  }
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
        if (!value) {
          return dtsDom.type.any;
        }
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

          const inter = dtsDom.create.interface(generateInterfaceName(interfaceName));
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

  function generateObjectDeclaration(value: object) {
    const obj = getTypeOfValue(value) as InterfaceDeclaration;
    obj.members.forEach((m) => intf.members.push(m));
    standaloneType.forEach((e) =>
      result.push(handlerResult(dtsDom.emit(e, { rootFlags: dtsDom.ContextFlags.Module })))
    );
    result.push(handlerResult(dtsDom.emit(intf, { rootFlags: dtsDom.ContextFlags.Module })))
    return obj;
  }

  if (Array.isArray(value) && value.length > 0) {
    const obj = getTypeOfValue(value[0]) as InterfaceDeclaration;
    standaloneType.forEach((e) =>
      result.push(handlerResult(dtsDom.emit(e, { rootFlags: dtsDom.ContextFlags.Module })))
    );
    const customType = dtsDom.create.type(generateInterfaceName("CustomType"), dtsDom.create.array(obj));
    result.push(handlerResult(dtsDom.emit(customType, { rootFlags: dtsDom.ContextFlags.Module })))
  } else {
    generateObjectDeclaration(value);
  }
  return result;
}



function handlerResult(res: string) {
  return res.replace(/\((.+)\)\[\]/g, "$1")
}
function getObjectKeys(value: object) {
  const names = Object.getOwnPropertyNames(value);
  return names;
}

export default generateDeclarationFile;