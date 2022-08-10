

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,
		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'build')]
	};
}
class Json2DtsWebViewPanel {
	public static readonly viewType = 'json2dts.view';
	public static currentPanel: Json2DtsWebViewPanel | undefined;
	private readonly _extensionUri: vscode.Uri;
	private readonly _panel: vscode.WebviewPanel;

	constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;
		const webview = this._panel.webview;
		this._panel.webview.html = this._getHtmlForWebview(webview);
		this._panel.onDidDispose(() => this.dispose(), null);

	}

	public dispose() {
		Json2DtsWebViewPanel.currentPanel = undefined;

		this._panel.dispose();

	}

	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;
		if (Json2DtsWebViewPanel.currentPanel) {
			Json2DtsWebViewPanel.currentPanel._panel.reveal(column);
			return;
		}

		const panel = vscode.window.createWebviewPanel(
			Json2DtsWebViewPanel.viewType,
			'json2dts',
			column || vscode.ViewColumn.One,
			getWebviewOptions(extensionUri),
		);
		Json2DtsWebViewPanel.currentPanel = new Json2DtsWebViewPanel(panel, extensionUri);

	}

	private _getAssetsUri(webview: vscode.Webview, filePath: string) {
		const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'build', filePath);
		const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
		const stylesResetUri = webview.asWebviewUri(scriptUri);
		return stylesResetUri;
	}

	private __handlerPublicPath(webview: vscode.Webview) {
		try {
			const files = fs.readdirSync(vscode.Uri.joinPath(this._extensionUri, 'build/static/js').path).map((i) => {
				return path.resolve(vscode.Uri.joinPath(this._extensionUri, 'build/static/js').path, i);
			});
			const publicPath = `https://file+.vscode-resource.vscode-cdn.net${vscode.Uri.joinPath(this._extensionUri, 'build').path}`;
			for (let i = 0; i < files.length; i++) {
				let bundle = fs.readFileSync(files[i], 'utf-8');
				if (bundle.startsWith('//done')) {
					continue;
				}
				bundle = `//done \r\n ${bundle.replace(/https:\/\/file\+\.vscode-resource\.vscode-cdn\.net/g, `${publicPath}/`)}`;
				fs.writeFileSync(files[i], bundle);
			}
		} catch (e) {
			console.error(e);
		}
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		this.__handlerPublicPath(webview);
		const jsonPath = vscode.Uri.joinPath(this._extensionUri, 'build', 'asset-manifest.json');
		const obj = JSON.parse(fs.readFileSync(jsonPath.path).toString());
		const mainJSUri = this._getAssetsUri(webview, obj.entrypoints[1]);
		const mainCSSUri = this._getAssetsUri(webview, obj.entrypoints[0]);

		const getIconFontUrl = (suffix: string) => {
			return this._getAssetsUri(webview, `iconfont.${suffix}`);
		}

		return `
		<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width,initial-scale=1" />
					<meta name="theme-color" content="#000000" />
					<meta name="description" content="Web site created using create-react-app"
						/>
					<title>json2dts</title>
					<style>
						@font-face  {
							font-family:iconfont;src:url('${getIconFontUrl('woff2')}') format('woff2'),url('${getIconFontUrl('woff')}') format('woff'),url('${getIconFontUrl('ttf')}') format('truetype')
						}
						.iconfont{
							cursor:pointer;
							font-family:iconfont!important;
							font-size:16px;
							font-style:normal;
							-webkit-font-smoothing:antialiased;
							-moz-osx-font-smoothing:grayscale
						}
						</style>
					<script defer="defer" src="${mainJSUri}"></script>
					<link href="${mainCSSUri}" rel="stylesheet" />
				</head>
				<body>
					<noscript>
						You need to enable JavaScript to run this app.
					</noscript>
					<div id="root"></div>
				</body>
			</html>
		`
	}
}



export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('json2dts.open', () => {
			Json2DtsWebViewPanel.createOrShow(context.extensionUri);
		})
	);


}

// this method is called when your extension is deactivated
export function deactivate() { }
