import React from 'react';

interface ISwitchProps {
  active: boolean;
  onChange: (active: boolean) => void;
  children: React.ReactNode
  localKey: string;
}

const Switch: React.FC<ISwitchProps> = ({ active,localKey, onChange, children }) => {

  return <div 
            onClick={() => {
              onChange(!active)
              if (active) {
                window.localStorage.setItem(localKey, '1');
              } else {
                window.localStorage.setItem(localKey, '0');
              }
            }}
            className="iconfont icon" style={{
              color: active ? '#18b6ea' :  '#fff2'
            }}>
          { children }
  </div>
}



export default Switch;
