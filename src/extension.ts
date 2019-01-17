import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import TemplateManager from './template-manager';

export function activate(context: vscode.ExtensionContext) {
	const manager = new TemplateManager(context.subscriptions);
	const tempDirPath = path.join(vscode.workspace.rootPath as string, '.custom-template');
	
	if (fs.existsSync(tempDirPath)) {
		manager.init();
	}
	console.log('extension active');
	const watchPath = path.join(vscode.workspace.rootPath as string, '.custom-template', '*.*');
	const watcher = vscode.workspace.createFileSystemWatcher(watchPath);
	watcher.onDidCreate((e: vscode.Uri) => manager.create(e.fsPath));
	watcher.onDidChange((e: vscode.Uri) => manager.change(e.fsPath));
	watcher.onDidDelete((e: vscode.Uri) => manager.delete(e.fsPath));
}

export function deactivate() {}
