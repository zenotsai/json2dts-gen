#!/usr/bin/env node
import log from './log'
import { Command } from 'commander';
import PkgJson from '../package.json';
import fs from 'fs';
import path from 'path';
import generateDeclarationFile, { parseJson } from './'
const program = new Command();



program
  .option('-c, --content <content>', 'json content')
  .option('-sep, --objectSeparate', 'Object types are defined individually', true)
  .option('-prefix, --prefix <prefix>', 'interface prefix')
  .option('-f, --file <file>', 'json file')
  .version(PkgJson.version)
  .parse();

program.parse(process.argv);

function isExistSync(filePath: string) {
  if (!filePath) {
    return false;
  }
  try {
    return !Boolean(fs.accessSync(filePath));
  } catch (e) {
    return false;
  }
}

const options = program.opts<{
  content: string;
  file: string;
  objectSeparate: boolean;
  prefix: string;
}>();
(() => {
  const { content, file, objectSeparate, prefix } = options;
  if (!content && !file) {
    log.warn('Missing required parameter --content or --file')
    return;
  }
  let targetObj;

  if (content) {
    targetObj = parseJson(content);
  } else {
    
    const filePath = path.resolve(process.cwd(), file);
    if (!isExistSync(filePath)) {
      log.warn(`file does not exist：${filePath}`)
      return;
    }
    targetObj = parseJson(fs.readFileSync(filePath, { encoding: 'utf-8' }));
  }

  console.log(generateDeclarationFile(targetObj, {
    objectSeparate,
    interfacePrefix: prefix
  }).join(''))
})()
