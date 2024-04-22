import { Button } from 'antd'
import React from 'react'

const ButtonComponent = ({size,bordered, styleButton,disabled, styleTextButton, textButton,disabledMore, ...rests}) => {
    console.log('textButton',textButton);
  return (
    <Button
        size={size}
        bordered={bordered}
        // icon={<SearchOutlined />}
        {...rests}
      
        style={{...styleButton,
            background:disabled ?' #ccc' : styleButton.background
        }}
        disabled={disabledMore}
      >
       <span style={styleTextButton}> {textButton}</span>
      </Button>
  )
}

export default ButtonComponent