import * as vscode from 'vscode';
import TemplateManager from './template-manager';

export function activate(context: vscode.ExtensionContext) {
	const manager = new TemplateManager(context.subscriptions);
	manager.run();
}

export function deactivate() {}
