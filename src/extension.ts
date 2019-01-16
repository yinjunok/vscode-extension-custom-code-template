import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const { workspace } = vscode;

function init(): string[] {
	const templateDir = path.join((workspace.rootPath as string), '.custom-template');
	const dirContent = fs.readdirSync(templateDir);
	const result: string[] = [];

	dirContent.forEach(content => {
		const p = path.join(templateDir, content);
		const state = fs.statSync(p);
		if (state.isFile()) {
			result.push(p);
		}
	});

	return result;
}

function readTemplate(src: string): string {
	const content = fs.readFileSync(src, 'utf8');
	return content;
}

interface ITemp {
	[propsName: string]: string;
}

export function activate(context: vscode.ExtensionContext) {
	const tmeps = init();
	let template: ITemp = {};

	tmeps.forEach(t => {
		template[t] = readTemplate(t);
	});
	
	

	console.log(template);
	// context.subscriptions.push();
}

// this method is called when your extension is deactivated
export function deactivate() {}
