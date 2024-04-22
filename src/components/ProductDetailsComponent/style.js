import { Col, Image, InputNumber } from "antd";
import { styled } from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
    height:64px;
    width:64px;
`
export const WrapperStyleColImage = styled(Col)`
       flex-basis: unset;
       display:flex; height:64px;
    width:64px;
`
export const WrapperStyleNameProduct = styled.h1`
margin: 0px;
color: rgb(39, 39, 42);
font-size: 20px;
font-weight: 500;
line-height: 150%;
word-break: break-word;
white-space: break-spaces;

`
export const WrapperStyleTextSell = styled.span`
color: rgb(120, 120, 120);
font-size: 20px;
font-weight: 500;
`
export const WrapperPriceProduct = styled.div`
    background:rgb(250,250,250);
    border-radius:4px;
`
export const WrapperPriceTextProduct = styled.h1`
    font-size: 24px;
    font-weight: 600;
    padding:10px;
    line-height: 40px;
`
export const WrapperAddressProduct = styled.div`
    span.address{
        text-decoration:underline;
        font-size:15px;
        line-height:24px;
        font-weight:500;
        white-space:nowrap;
            overflow: hidden;
            text-overflow:ellipsisl;
    };
    span.change-address{
    color: rgb(10, 104, 255);
    }
`
export const WrapperQualityProduct = styled.div`
  display:flex;
  gap:4px;
  align-items:center;
  border-radius:2px;
  border:1px solid #ccc;
  width:120px;  
  border-radius:4px;
`

export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm{
    width:60px;
    border-top:none;
    border-bottom:none;
    &.ant-input-number-handler-wrap{
        display:none!important;
    }
  }
  
`
