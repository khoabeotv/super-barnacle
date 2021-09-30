import { useEffect, useRef } from 'react';
import { message, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const Copy = ({ children, copyText, tip }) => {
  if (!children && !copyText) return null

  const span = useRef();
  copyText = copyText || children;
  useEffect(() => {
    span.current.addEventListener('copy', (event) => {
      event.preventDefault();
      if (event.clipboardData) {
        event.clipboardData.setData('text/plain', copyText);
        message.success(`Copy: ${copyText}`);
      }
    });
  }, [span]);

  return (
    <Tooltip title={tip || 'Click để sao chép'} placement="right">
      <span
        ref={span}
        onClick={(e) => {
          e.stopPropagation();
          document.execCommand('copy');
        }}
        style={{ whiteSpace: 'pre-wrap', cursor: 'pointer',  }}
        className="link">
        {children}
      </span>
    </Tooltip>
  );
};

export default Copy;
