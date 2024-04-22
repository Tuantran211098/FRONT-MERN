import { Button, Input } from "antd";
import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textButton,
    bordered,
    backgroundColorInput='#fff',
    backgroundColorButton='rgb(13,92,182)',
    colorButton='#fff',
    
  } = props;
  console.log('props',props);
  return (
    <div style={{ display: "flex", background: "#fff" }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        style={{ borderRadius: "1px", background: backgroundColorInput }}
       {...props}
      />
      <ButtonComponent
        size={size}
        bordered={bordered}
        icon={<SearchOutlined />}
        textButton={textButton}
        styleTextButton={{color:colorButton}}
        styleButton={{ borderRadius: "1px", background: backgroundColorButton, color:colorButton,border:!bordered && '1px' }}
      />
      
    </div>
  );
};

export default ButtonInputSearch;
