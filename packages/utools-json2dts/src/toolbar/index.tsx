import React from 'react';
import ReactTooltip from 'react-tooltip';
import cn from 'classnames'
import './toolbar.css'

interface IToolbarProps {
  options: {
    key: string;
    label: string;
    component?: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }[]
}
// 

const Toolbar: React.FC<IToolbarProps> = ({ options}) => {
  return <div className="toolbar">
    {
      (options || []).map((i) => {
          return  <div key={i.key} className="toolbar-item">
            { i.component ? 
              <span  data-tip data-for={i.key} > { i.component } </span>
               : 
              <span onClick={i.onClick}  data-tip data-for={i.key} className={cn("iconfont icon", i.className)}/> }
            <ReactTooltip id={i.key} place="bottom" type='info' effect='solid'>
              <span>{ i.label } </span>
            </ReactTooltip>
          </div>
      })
    }
</div>
}

export default Toolbar;
