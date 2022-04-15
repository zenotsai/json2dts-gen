import React from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import { editor } from 'monaco-editor'
import './editor.css'

interface IEditorProps {
  value?: string;
  options?: MonacoEditorProps['options'];
  language?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

const PLACEHOLDER_SELECTOR = ".monaco-placeholder";


const Editor: React.FC<IEditorProps> = (props) => {
  const refs = React.useRef<any>();
  const { value, placeholder, onChange, language = "javascript", options =  {} } = props;

  function hidePlaceholder() {
    const dom: HTMLDivElement | null = document.querySelector(PLACEHOLDER_SELECTOR);
    if (dom) {
      dom.style.display = "none";
    }
  }



  function showPlaceholder(value: string) {
    if (value === "") {
      const dom: HTMLDivElement | null = document.querySelector(PLACEHOLDER_SELECTOR);
      if (dom) {
        dom.style.display = "initial";
      }
    
    }
  }
  const editorDidMount = (instance: editor.ICodeEditor) => {
    
    instance.onDidBlurEditorWidget(() => {
      showPlaceholder(instance.getValue());
    });

    instance.onDidFocusEditorWidget(() => {
      hidePlaceholder();
    });
  }
  return  <div className="editor">
        <MonacoEditor
            value={value}
            ref={refs}
            language={language}
            options={{
              minimap: {
                enabled: false
              },
              automaticLayout: true,
              fontSize: 16,
              ...options
            }}
            editorDidMount={editorDidMount}
            onChange={onChange}
            theme="vs-dark"
        />
     <div className="monaco-placeholder">{ placeholder }</div>
  </div>
  
 
}

export default Editor;
