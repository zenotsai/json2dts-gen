import './App.css';
import generateDeclarationFile, { parseJson } from 'json2dts-gen';
import { useMemo, useState }  from 'react'
import ClipboardButton from './ClipboardButton';
import useDebounceFn  from './useDebounceFn';
import Toolbar from './toolbar'
import Editor from './edtor'
import useUpdateEffect  from './useUpdateEffect';
import PrefixSwitch from './prefix-switch';


const LOCAL_KEY_INTERFACE_PREFIX = "001";
const LOCAL_KEY_SEPARATE_PREFIX = "002";


function getDefaultValue (key: string, defaultValue: boolean) {
  const value = window.localStorage.getItem(key);
  if (!value) {
    return defaultValue;
  }
  return value === '1';
}
function App() {
  const [result, setResult] = useState<string[]>([]);
  const [json, setJson] = useState<string>();
  const [option, setOption] = useState({
    interfacePrefix: getDefaultValue(LOCAL_KEY_INTERFACE_PREFIX, false),
    objectSeparate: getDefaultValue(LOCAL_KEY_SEPARATE_PREFIX, true)
  });

  const { run: onChange } = useDebounceFn(
    (value: string) => {
      try {
        setJson(value);
        const res = generateDeclarationFile(value, {
          ...option,
          interfacePrefix: option.interfacePrefix ? 'I' : ''
        }); 
        setResult(res || [])
      } catch (e: any) {
        setResult([e.message])
      }
    },
    {
      wait: 500,
    },
  );

  useUpdateEffect(() => {
    if (json) {
      onChange(json)
    }

  }, [option])


 
  const resultMsg = useMemo(() => {
    return (result || []).join('')
  }, [result])
  return (
    <div className="App">
      <div className='panel'>
        <Toolbar options={[
          {
            label: 'format',
            key: 'format',
            className: 'formatIcon',
            onClick: () => {
              setJson(JSON.stringify(parseJson(json!), null, 2));
            }
          },
          {
            label: 'clear',
            className: 'clearIcon',
            key: 'clear',
            onClick: () => {
              setJson('');
            }
          }
        ]}/>
        <Editor
          value={json}
          onChange={onChange}
        />
       
      </div>
      <div className='panel'>
      <ClipboardButton text={resultMsg} className="copyBtn"/>
      <Toolbar
        options={[
          {
            label: 'Add an "I" prefix to the interface when formatting',
            key: 'autoPrefix',
            component: <PrefixSwitch localKey={LOCAL_KEY_INTERFACE_PREFIX} active={option.interfacePrefix} onChange={(active) => {
              setOption({
                ...option,
                interfacePrefix: active
              })
            }}>
               &#xe628;
            </PrefixSwitch>
          },
          {
            label: 'Object generates a separate interface',
            key: 'separate',
            component: <PrefixSwitch localKey={LOCAL_KEY_SEPARATE_PREFIX} active={option.objectSeparate} onChange={(active) => {
              setOption({
                ...option,
                objectSeparate: active
              })
            }}>
             &#xe622;
            </PrefixSwitch>
          }
        ]}
      />
      <Editor
          value={resultMsg}
          language="typescript"
          options={{
            readOnly: true,
          }}
          onChange={onChange}
        />
      </div>
     
    </div>
  );
}

export default App;
