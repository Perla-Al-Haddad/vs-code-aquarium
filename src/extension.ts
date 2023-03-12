/**
 * This code is an example of a VS Code extension that creates a custom view in the sidebar to display an aquarium. 
 * The extension uses TypeScript to define a class hierarchy for the webview container and view provider.
 * 
 * The AquariumWebviewContainer class is an abstract base class that defines the interface for the view provider. 
 * It has an abstract method getWebview() that returns a vscode.Webview object. 
 * It also has a protected method _getHtmlForWebview() that generates the HTML for the webview.
 * 
 * The AquariumWebviewViewProvider class extends AquariumWebviewContainer. 
 * It defines a static viewId property that identifies the view in the package.json file. 
 * The resolveWebviewView() method sets the _webviewView property and configures the webview with getWebviewOptions() and _getHtmlForWebview(). 
 * The getWebview() method checks if the _webviewView is active and returns the webview if it is.

 * The activate() function initializes an instance of AquariumWebviewViewProvider and registers it as a view provider using registerWebviewViewProvider().

 * Overall, this code demonstrates how to create a custom view in VS Code using TypeScript and the vscode module.
 
 */

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/**
 * This function returns the needed options for the view
 * 
 * The enableScripts value specifies if the view will be able to use javascript
 * The localResourceRoots points to the path that will store all needed media assets for the extension
 * like images and styles
 * 
 * @param extensionUri 
 * @returns 
 */
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
	protected _extensionUri: vscode.Uri; // Store the extension URI to access files relative to the extension

	constructor(extensionUri: vscode.Uri) {
		this._extensionUri = extensionUri;
	}

	/**
	 * This function needs to be implemented by any subclasses of the AquariumWebviewContainer class
	 * to define how the webview should be formatted and returned
	 */
	protected getWebview(): vscode.Webview {
		throw new Error('Not implemented');
	}

	/**
	 * This function dynamically gets and sets the HTML for the webview
	 */
	protected _update() {
		const webview = this.getWebview();
		webview.html = this._getHtmlForWebview(webview);
	}

	public update() { }

	/**
	 * This function formats the HTML for the webview
	 * 
	 * It imports the style sheets and background images and sets up the structure of the HTML
	 * 
	 * @param webview 
	 * @returns HTML string for the webview
	 */
	protected _getHtmlForWebview(webview: vscode.Webview): string {
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

/**
 * This class extends the AquariumWebviewContainer class
 * 
 * it sets our custom viewId variable which is the id of the custom view that we created in the package.json file
 */
class AquariumWebviewViewProvider extends AquariumWebviewContainer {
	public static readonly viewId: string = 'aquariumView'; // id of the custom view that we wa	nt to display the aquarium in

	private _webviewView?: vscode.WebviewView; // private variable to store the webview 

	/**
	 * This function sets the webview global variable and sets the options and html of the webview
	 * 
	 * @param webviewView 
	 */
	resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
		this._webviewView = webviewView;

		this._webviewView.webview.options = getWebviewOptions(this._extensionUri);
		this._webviewView.webview.html = this._getHtmlForWebview(this._webviewView.webview);
	}

	update() {
		this._update();
	}

	/**
	 * This function implements the abstract getWebView function of the AquariumWebviewContainer class
	 * 
	 * Checks to make sure the webview is active before returning it.
	 * 
	 * @returns the webview 
	 */
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

	// initialize the webview provider
	let webviewViewProvider = new AquariumWebviewViewProvider(context.extensionUri);

	// add the webview provider to the subsriptions
	// This registers the view for the extension.
	context.subscriptions.push(
		// registerWebviewViewProvider is the function that allows us to add a view to the side bar of vs-code
		// we must pass the id of the view that is defined in the package.json
		// and we must pass the view provider 
		// the simplest example of the webview provider would be the following:
		// 
		// 	    var thisProvider={
		// 			resolveWebviewView: function(thisWebview, thisWebviewContext, thisToken){
		// 				thisWebviewView.webview.options={enableScripts:true}
		// 				thisWebviewView.webview.html="<!doctype><html>[etc etc]";
		// 			}
		// 		};
		// 
		// We need to provide a resolveWebviewView function that sets the options and html of the view

		vscode.window.registerWebviewViewProvider(
			AquariumWebviewViewProvider.viewId,
			webviewViewProvider,
		),
	);
}

// This method is called when your extension is deactivated
export function deactivate() { }
