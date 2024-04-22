import { Input } from 'antd'
import React from 'react'

const InputComponent = ({props,size,placeholder,bordered,style, ...rests}) => {
  console.log('props InputComponent',props);
  // const handleOnchange = (e) =>{
  //   rests.onChange(e.target.value)
  // }
  return (
    <Input
    // onChange={handleOnchange}
    size={size}
    placeholder={placeholder}
    bordered={bordered}
    style={{ style }}
    {...rests}
  />
  )
}

export default InputComponent