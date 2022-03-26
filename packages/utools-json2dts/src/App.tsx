import './App.css';
import type { editor } from 'monaco-editor'
import MonacoEditor from 'react-monaco-editor';
import generateDeclarationFile from 'json2dts-gen';
import { useMemo, useState, useRef }  from 'react'
import ClipboardButton from './ClipboardButton';
import useDebounceFn  from './useDebounceFn';
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
// import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';

const PLACEHOLDER_SELECTOR = ".monaco-placeholder";

function showPlaceholder(value: string) {
  if (value === "") {
    const dom: HTMLDivElement | null = document.querySelector(PLACEHOLDER_SELECTOR);
    if (dom) {
      dom.style.display = "initial";
    }
  
  }
}

function hidePlaceholder() {
  const dom: HTMLDivElement | null = document.querySelector(PLACEHOLDER_SELECTOR);
  if (dom) {
    dom.style.display = "none";
  }
}

function parseJson (value: string) {
  try {
    return JSON.parse(value.trim());
     
  } catch (e: any) {
    // eslint-disable-next-line
    return new Function(`return ${ value }`)();
  }
}

function App() {
  const [result, setResult] = useState<string[]>([]);
  const refs = useRef<any>();

  const { run: onChange } = useDebounceFn(
    (value: string) => {
      try {
        console.log('value', value)
        const res = generateDeclarationFile(parseJson(value)); 
        setResult(res || [])
      } catch (e: any) {
        setResult([e.message])
      }
    },
    {
      wait: 500,
    },
  );
  const editorDidMount = (instance: editor.ICodeEditor) => {
    
    instance.onDidBlurEditorWidget(() => {
      showPlaceholder(instance.getValue());
    });

    instance.onDidFocusEditorWidget(() => {
      hidePlaceholder();
    });
  }

 
  const resultMsg = useMemo(() => {
    return (result || []).join('')
  }, [result])
  return (
    <div className="App">
      <div className='panel'>
        <MonacoEditor
          ref={refs}
          language="javascript"
          options={{
            minimap: {
              enabled: false
            },
            automaticLayout: true,
            fontSize: 16
          }}
          editorDidMount={editorDidMount}
          onChange={onChange}
          theme="vs-dark"
        />
        <div className="monaco-placeholder">代码写这里~ </div>
      </div>
      <div className='panel'>
      <ClipboardButton text={resultMsg} className="copyBtn"/>
      <MonacoEditor
          value={resultMsg}
          language="typescript"
          options={{
            automaticLayout: true,
            minimap: {
              enabled: false
            },
            readOnly: true,
            fontSize: 16
          }}
          theme="vs-dark"
        />
      </div>
     
    </div>
  );
}

export default App;
