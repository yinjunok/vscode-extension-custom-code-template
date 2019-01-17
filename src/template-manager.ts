import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as utils from './utils';

const {
  TextEdit,
  Position,
  Range,
  workspace
} = vscode;

interface ITemplate {
  [propName: string]: {
    content : string;
    provider: vscode.Disposable;
    ext     : string;
    basename: string;
  };
}

class TemplateManger {
  private template: ITemplate = {};
  private subscriptions: vscode.Disposable[];
  private tempDir: string = path.join((workspace.rootPath as string), '.custom-template');

  constructor(subs: vscode.Disposable[]) {
    this.subscriptions = subs;
  }

  public run() {
    const watchPath = path.join(this.tempDir, '*.*');
    const watcher = vscode.workspace.createFileSystemWatcher(watchPath);
    watcher.onDidCreate((e: vscode.Uri) => this.create(e.fsPath));
    watcher.onDidChange((e: vscode.Uri) => this.change(e.fsPath));
    watcher.onDidDelete((e: vscode.Uri) => this.delete(e.fsPath));

    if (fs.existsSync(this.tempDir)) {
      this.init();
    }
  }

  public async init() {
    const dirContent = await utils.readdirPromise(this.tempDir);
    const files: string[] = [];
  
    // 判断是否为文件
    for (let i = 0; i < dirContent.length; ++i) {
      const filePath = path.join(this.tempDir, dirContent[i]);
      const state = await utils.statePromise(filePath);
      if (state.isFile()) {
        files.push(filePath);
      }
    }
  
    // 创建 provider
    files.forEach(f => {
      this.create(f);
    });
  }

  public async create(src: string) {
    const content =  await utils.readFilePromise(src);
    const ext = path.extname(src);
    const basename = path.basename(src);
    const self = this;

    const provider = vscode.languages.registerCompletionItemProvider({ pattern: `**/*${ext}` }, {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token   : vscode.CancellationToken,
        context : vscode.CompletionContext
      ) {
        const snippetCompletion = new vscode.CompletionItem(basename);

        // 替换字符的范围
        const start = new Position(position.line, position.character - 1);
        const end = new Position(position.line, position.character);
        const range = new Range(start, end);

        const content = self.getContent(src);
        snippetCompletion.additionalTextEdits = [TextEdit.delete(range)];
        snippetCompletion.insertText = new vscode.SnippetString(content);
        snippetCompletion.documentation = new vscode.MarkdownString(content);
        return [
          snippetCompletion
        ];
      }
    }, '~');

    this.template[src] = {
      content,
      ext,
      provider,
      basename,
    }
    this.subscriptions.push(provider);
  }

  public async change(src: string) {
    this.template[src].content = await utils.readFilePromise(src);
  }

  public delete(src: string): void {
    const temp = this.template[src];
    const index = this.subscriptions.indexOf(temp.provider);
    this.subscriptions.splice(index, 1);
    delete this.template[src];
  }

  private getContent(src: string): string {
    return this.template[src].content;
  }
}

export default TemplateManger;