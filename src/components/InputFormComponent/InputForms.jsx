import React, { useState } from 'react'
import { Input } from 'antd';
import { WrapperInputStyle } from './style';
import { ZhihuCircleFilled } from '@ant-design/icons';
const InputForms = (props) => {
    // const [ valueInput, setValueInput] = useState('')
    const {placeholder = "Nhâp text", ...rests} = props;
    // console.log('rests',rests);
    const handleOnchangeInput =(e) =>{
      props.onChange(e.target.value)
    }
  return (
    <div><WrapperInputStyle placeholder={placeholder} 
    value={props.value}  {...rests}
    onChange={handleOnchangeInput}
   /></div>
  )
}

export default InputForms