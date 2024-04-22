import React from 'react'
import { WrapperContent, WrapperLabelText, WrapperTextPrice, WrapperTextValue } from './style'
import { Checkbox, Col, Rate, Row } from 'antd';
const NavbarComponent = () => {
    const onChange = (checkedValues) => {
        // console.log('checked = ', checkedValues);
      };
    const renderContent = (type, option)=>{
        switch(type){
            case 'text':
                 return option.map((option)=>{
                    return(
                        <WrapperTextValue key={option}>{option}</WrapperTextValue>
                    )
                 })
            case 'checkbox':
                return(
                    <Checkbox.Group style={{ width: '100%',display:'flex',flexDirection:'column' }} onChange={onChange}>
                        {option.map((option)=>{
                            return(
                                <Checkbox value={option.value}>{option.label}</Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                )
            case 'star':
                return(
                        option.map((option)=>{
                            return(
                                <div style={{display:'flex'}}>
                                    <Rate style={{fontSize:'12px'}} disabled defaultValue={option} />
                                    <span style={{fontSize:'12px'}} >{`từ ${option} sao`}</span>
                                </div>
                            )
                        })
                )
            case 'price':
                return(
                        option.map((option)=>{
                            return(
                                <WrapperTextPrice >{option}</WrapperTextPrice>
                            )
                        })
                )
            default:  
                return;
        }
    }
  return (
    <div>
       <WrapperLabelText>Label</WrapperLabelText>
       <WrapperContent>
            {renderContent('text',['TIVI','TU LANH','MÁY GIẶT'])}
       </WrapperContent>
       <WrapperContent>
            {renderContent('checkbox',[
                    {value:'a',label:'A'},
                    {value:'b',label:'B'}
            ])}
        </WrapperContent>
        <WrapperContent>
            {renderContent('star',[3,4,5])}
        </WrapperContent>
        <WrapperContent>
            {renderContent('price',['duoi 40', 'tren 50.000'])}
        </WrapperContent>
    </div>
  )
}

export default NavbarComponent