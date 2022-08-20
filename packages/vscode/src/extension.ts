

import * as vscode from 'vscode';


import Json2DtsWebViewPanel from './Json2DtsWebViewPanel';
import { convertTs2EditorSelected } from './utils';


export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('json2dts.open', () => {
			Json2DtsWebViewPanel.createOrShow(context.extensionUri);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('json2dts.convertFromSelected', async () => {
			const textEditor = vscode.window.activeTextEditor;
			if (!textEditor) {
				return;
			}
			const selection = textEditor.selection;
			const selectedText = textEditor?.document.getText(selection);
			if (!selectedText) {
				return;
			}
			try {
				convertTs2EditorSelected(selectedText);
			} catch (e) {
				vscode.window.showErrorMessage('JSON2dts: Convert Fail');
			}

		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('json2dts.convertFromClipboard', async () => {

			try {
				let clipboardContent = await vscode.env.clipboard.readText();
				if (!clipboardContent) {
					return;
				}
				convertTs2EditorSelected(clipboardContent);
			} catch (e) {
				console.error(e);
				vscode.window.showErrorMessage('JSON2dts: Convert Fail');
			}
		})
	);




}

// this method is called when your extension is deactivated
export function deactivate() { }
