"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
const pathe_1 = require("pathe");
const json2dts_gen_1 = require("json2dts-gen");
function getWebviewOptions(extensionUri) {
    return {
        // Enable javascript in the webview
        enableScripts: true,
        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'build')]
    };
}
class Json2DtsWebViewPanel {
    constructor(panel, extensionUri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
        this._panel.onDidDispose(() => this.dispose(), null);
    }
    dispose() {
        Json2DtsWebViewPanel.currentPanel = undefined;
        this._panel.dispose();
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (Json2DtsWebViewPanel.currentPanel) {
            Json2DtsWebViewPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(Json2DtsWebViewPanel.viewType, 'json2dts', column || vscode.ViewColumn.One, getWebviewOptions(extensionUri));
        Json2DtsWebViewPanel.currentPanel = new Json2DtsWebViewPanel(panel, extensionUri);
    }
    _getAssetsUri(webview, filePath) {
        const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'build', filePath);
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
        const stylesResetUri = webview.asWebviewUri(scriptUri);
        return stylesResetUri;
    }
    __handlerPublicPath(webview) {
        try {
            const files = fs.readdirSync((0, pathe_1.resolve)(this._extensionUri.path, 'build/static/js')).map((i) => {
                return (0, pathe_1.resolve)(vscode.Uri.joinPath(this._extensionUri, 'build/static/js').path, i);
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
        }
        catch (e) {
            console.error(e);
        }
    }
    _getHtmlForWebview(webview) {
        this.__handlerPublicPath(webview);
        const jsonPath = (0, pathe_1.resolve)(this._extensionUri.path, 'build', 'asset-manifest.json');
        const obj = JSON.parse(fs.readFileSync(jsonPath).toString());
        const mainJSUri = this._getAssetsUri(webview, obj.entrypoints[1]);
        const mainCSSUri = this._getAssetsUri(webview, obj.entrypoints[0]);
        const getIconFontUrl = (suffix) => {
            return this._getAssetsUri(webview, `iconfont.${suffix}`);
        };
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
		`;
    }
}
Json2DtsWebViewPanel.viewType = 'json2dts.view';
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('json2dts.open', () => {
        Json2DtsWebViewPanel.createOrShow(context.extensionUri);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('json2dts.convert', async (editBuilder) => {
        const textEditor = vscode.window.activeTextEditor;
        if (!textEditor) {
            return; // No open text editor
        }
        var selection = textEditor.selection;
        try {
            let clipboardContent = await vscode.env.clipboard.readText();
            textEditor.edit(function (editBuilder) {
                const res = (0, json2dts_gen_1.default)(clipboardContent.toString());
                console.log(res);
                // @ts-ignore
                editBuilder.replace(selection, res.join('\n'));
            });
        }
        catch (e) {
            // @ts-ignore
            vscode.window.showErrorMessage(e.message);
        }
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map