import { Disposable } from 'vscode';

interface ITemplate {
  [propName: string]: {
    content: string;
    provider: Disposable;
  }
}

class TemplateManger {
  private template: ITemplate | undefined;

  
}

export default TemplateManger;