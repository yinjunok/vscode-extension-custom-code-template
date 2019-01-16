import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const { workspace, Position, Range, TextEdit } = vscode;

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
	
	const providers: vscode.Disposable[] = [];

	tmeps.forEach(t => {
		const ext = path.extname(t);
		console.log(`**/*${ext}`);
		const provider = vscode.languages.registerCompletionItemProvider({ pattern:  `**/*.{ts,js}` }, {
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
				const snippetCompletion = new vscode.CompletionItem(path.basename(t));

				const start = new Position(position.line, position.character - 1);
				const end = new Position(position.line, position.character);
				const range = new Range(start, end);

				const content = template[t];
				snippetCompletion.additionalTextEdits = [TextEdit.delete(range)];
				snippetCompletion.insertText = new vscode.SnippetString(content);
				snippetCompletion.documentation = new vscode.MarkdownString(content);
				return [
					snippetCompletion
				];
			}
		}, '~');

		providers.push(provider);
	});

	
	const provider2 = vscode.languages.registerCompletionItemProvider(
		'plaintext',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				// get all text until the `position` and check if it reads `console.`
				// and iff so then complete if `log`, `warn`, and `error`
				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('console.')) {
					return undefined;
				}

				return [
					new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
				];
			}
		},
		'.' // triggered whenever a '.' is being typed
	);

	context.subscriptions.push(...providers, provider2);
}

// this method is called when your extension is deactivated
export function deactivate() {}
