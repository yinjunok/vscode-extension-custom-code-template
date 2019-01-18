
## 演示

![示例](./demo.gif)

## 为什么要写这扩展

vscode 上已经有很多代码补全插件, 代码提示补全相当完善. 代码补全是针对语言, 而不是针对项目的.
不同的项目经常会有很多相同的模板代码, 比如写 react 的时候:

```typescript
import * as React from 'react';

class DemoComponent extends React.Component {
  render() {
  
  }
}

export default DemoComponent;
```
每次新建组件都需要写类似的模板代码, 写多了, 就很反感.于是动了写这个插件的念头.

## 使用方法

1. 在项目根目录新建一个名为 `.custom-template` 存放模板代码的文件夹.
2. 在文件夹里写相应语言的模板代码. 更强大的定制模板可以使用 [SnippetString](https://code.visualstudio.com/api/references/vscode-api#SnippetString). 
3. 使用 `~` 激活模板填充. 本扩展使用了 AI 智能识别相应语言.

![示例2](./demo2.gif)

## 小问题
使用 [SnippetString](https://code.visualstudio.com/api/references/vscode-api#SnippetString) 时, vscode 会报语法错误, 尝试在设置里忽略 `.custom-template` 的语法检查, 没成功.
这个不影响使用, 只是看起来有点不爽.
