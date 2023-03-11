// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path = require('path');
import * as vscode from 'vscode';

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions & vscode.WebviewPanelOptions {
	return {
		enableScripts: true,
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
	};
}


interface IAquariumPanel {
	update(): void;
}

class AquariumWebviewContainer implements IAquariumPanel {
	protected _extensionUri: vscode.Uri;
	protected _disposables: vscode.Disposable[] = [];

	constructor(
		extensionUri: vscode.Uri,
	) {
		this._extensionUri = extensionUri;
	}

	protected getWebview(): vscode.Webview {
		throw new Error('Not implemented');
	}

	protected _update() {
		const webview = this.getWebview();
		webview.html = this._getHtmlForWebview(webview);
	}

	public update() { }

	protected _getHtmlForWebview(webview: vscode.Webview) {
		const stylesPathMainPath = vscode.Uri.joinPath(
			this._extensionUri,
			'media',
			'style.css',
		);
		const backgroundPathMainPath = vscode.Uri.joinPath(
			this._extensionUri,
			'media',
			'background.png',
		);

		const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
		const backgroundImageUri = webview.asWebviewUri(backgroundPathMainPath);

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesMainUri}" rel="stylesheet">
				<style>
					.aquarium-view {
						background-image: url('${backgroundImageUri}');
					}
				</style>
				<title>VS Code Aquarium</title>
			</head>
			<body>
				<div class='aquarium-view'>
				</div>
			</body>
			</html>
		`;
	}
}

class AquariumWebviewViewProvider extends AquariumWebviewContainer {
	public static readonly viewType = 'aquariumView';

	private _webviewView?: vscode.WebviewView;

	resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
		this._webviewView = webviewView;

		webviewView.webview.options = getWebviewOptions(this._extensionUri);
		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
	}

	update() {
		this._update();
	}

	getWebview(): vscode.Webview {
		if (this._webviewView === undefined) {
			throw new Error(
				vscode.l10n.t(
					'Panel not active, make sure the aquarium view is visible before running this command.',
				),
			);
		} else {
			return this._webviewView.webview;
		}
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let webviewViewProvider = new AquariumWebviewViewProvider(
        context.extensionUri,
    );

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            AquariumWebviewViewProvider.viewType,
            webviewViewProvider,
        ),
    );
}

// This method is called when your extension is deactivated
export function deactivate() { }
