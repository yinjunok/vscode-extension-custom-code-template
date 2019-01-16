import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface ITemplate {
  [propName: string]: {
    content: string;
    provider: vscode.Disposable;
    ext: string;
    basename: string;
  };
}

class TemplateManger {
  private template: ITemplate;
  private subscriptions: vscode.Disposable[];

  constructor(temp: ITemplate, subs: vscode.Disposable[]) {
    this.template = temp;
    this.subscriptions = subs;
  }

  create(src: string) {
    const content = fs.readFileSync(src, 'utf8');
    const ext = path.extname(src);
    const basename = path.basename(src);
    const provider = vscode.languages.registerCompletionItemProvider({ pattern: `**/*${ext}` }, {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
        const snippetCompletion = new vscode.CompletionItem(basename);

        const start = new vscode.Position(position.line, position.character - 1);
        const end = new vscode.Position(position.line, position.character);
        const range = new vscode.Range(start, end);

        const content = this.getCongent(src);
        snippetCompletion.additionalTextEdits = [TextEdit.delete(range)];
        snippetCompletion.insertText = new vscode.SnippetString(content);
        snippetCompletion.documentation = new vscode.MarkdownString(content);
        return [
          snippetCompletion
        ];
      }
    }, '~');
  }

  change(src: string) {
    this.template[src].content = fs.readFileSync(src, 'utf8');
  }

  delete(src: string) {

  }

  getCongent(src: string) {
    return this.template[src].content;
  }
}

export default TemplateManger;