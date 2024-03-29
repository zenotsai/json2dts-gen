import type { ObjectType, InterfaceDeclaration, ArrayTypeReference, PrimitiveType } from './dts-dom';
import * as dtsDom from './dts-dom';
import jsonFixerBrowser from 'json-fixer-browser';
import camelcase from 'camelcase';


export type IOptions = {
  objectSeparate?: boolean;
  interfacePrefix?: string;
  propertyKeyCamelcase?: boolean;
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

function jsonFn(value: string) {
  try {
    return new Function(`return ${value}`)();
  } catch (e) {
    return null;
  }

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
    }
  }
  return null
}
function looseParseJson(value: string): object {
  let result = jsonFn(value);
  if (!result) {
    result = jsonFixerObject(value);
  }
  if (!result) {
    result = jsonFixer(value);
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




function generateDeclarationTypeScript(json: string, options: IOptions = Object.create(null)): string {
  const { objectSeparate = true, interfacePrefix = '', propertyKeyCamelcase } = options;
  const value = parseJson(json);
  if (!value) {
    throw new Error('json2dts: conversion failure');
  }
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
          return dtsDom.create.property(propertyKeyCamelcase ? camelcase(key) : key, getTypeOfValue(value[key], key));
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
      result.push(dtsDom.emit(e, { rootFlags: dtsDom.ContextFlags.Module }))
    );
    result.push(dtsDom.emit(intf, { rootFlags: dtsDom.ContextFlags.Module }))
    return obj;
  }

  if (Array.isArray(value) && value.length > 0) {
    const obj = getTypeOfValue(value[0]) as InterfaceDeclaration;
    standaloneType.forEach((e) =>
      result.push(dtsDom.emit(e, { rootFlags: dtsDom.ContextFlags.Module }))
    );
    const customType = dtsDom.create.type(generateInterfaceName("CustomType"), dtsDom.create.array(obj));
    result.push(dtsDom.emit(customType, { rootFlags: dtsDom.ContextFlags.Module }))
  } else {
    generateObjectDeclaration(value);
  }
  return result.join('\n');
}




function getObjectKeys(value: object) {
  const names = Object.getOwnPropertyNames(value);
  return names;
}

export default generateDeclarationTypeScript;