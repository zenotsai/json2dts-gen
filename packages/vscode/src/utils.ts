import * as vscode from 'vscode';
import generateDeclaration from "json2dts-gen";


export const convertTs2EditorSelected = (text: string) => {
  const textEditor = vscode.window.activeTextEditor;
  if (!textEditor) {
    return;
  }
  var selection = textEditor.selection;
  textEditor.edit(function (editBuilder) {
    const config = vscode.workspace.getConfiguration('JSON2dts');
    const res = generateDeclaration(text.toString(), {
      propertyKeyCamelcase: config.propertyKeyCamelcase,
      objectSeparate: config.objectSeparate,
      interfacePrefix: config.interfacePrefix ? 'I' : ''
    });
    // @ts-ignore
    editBuilder.replace(selection, res);
  });
}