import  { FC, useEffect, useMemo } from 'react';
import ClipboardJS from 'clipboard';

interface IClipboardButtonProps {
  text: string;
  className?: string;
}

const ClipboardButton: FC<IClipboardButtonProps> = ({ className, text }) => {

  const showBtn = useMemo(() => {
    return text && text.trim().length > 0;
  }, [text])
  
  useEffect(() => {
    const btnId = '#copyBtn'
    const clipboard = new ClipboardJS(btnId);
    clipboard.on('success', function (e) {
      e.clearSelection();
      const ele = document.querySelector(btnId);
      ele!.textContent = 'Copied'
      setTimeout(() => {
        ele!.textContent = 'Copy'
      }, 300)

    });
  }, [])

  if (!showBtn) {
    return <></>
  }
  
  return<button
      id="copyBtn"
      className={className}
      data-clipboard-text={text}
    >
      Copy
    </button>
}

export default ClipboardButton;
