import { Upload } from "antd";
import { styled } from "styled-components";

export const WrapperHeader = styled.h1`
 color:#000;
 font-size:16px
 margin-bottom:4px;
`
export const WrapperContentProfile = styled.div`
display:flex;
flex-direction:column;
border:1px solid #ccc;
width:500px;
margin:0 auto;
border-radius:10px;
padding:10px;
`
export const WrapperLabel = styled.label`
color:#000;
font-size:12px;
line-height:16px;
font-weight:600;  
width:100px;
`
export const WrapperInput = styled.div`
    display:flex;
    align-items:center;
    gap:30px;
    padding:10px 0;
`

export const WrapperUpload = styled(Upload)`
  & .ant-upload-list-item-name{
    display:none;
  }
`
