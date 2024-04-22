import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import React from "react";
import { StyleNameProduct, WrapperPriceText, WrapperReportText, WrapperDiscountText,WrapperCardStyle } from "./style";
import {
    StarOutlined
  } from '@ant-design/icons';
import logo from '../../assets/images/CHINHHANG.png'
import { Image } from "antd";
import { WrapperStyleTextSell } from "../ProductDetailsComponent/style";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../ultils";

const CardComponent = (props) => {
  // console.log('props props');
  const {countIntock,description,image,name,price,rating,type,discount,selled,id} = props
  const navigate = useNavigate()
  const handleDetailsProduct = () =>{
    navigate(`/product-details/${id}`)
  }
  return (
    <div>
      <WrapperCardStyle
        hoverable
        style={{ width: 200,border:'1px solid'}}
        bordered={true}
        bodyStyle={{padding:'10px'}}
        cover={
          <img
            alt="example"
            src={image}
          />
        }
        onClick={()=> countIntock > 0 && handleDetailsProduct(id)}
        disabled = {countIntock <= 0 ? true : false}
      >
        <img src={image} style={{width:'68px',height:'14px', position:'absolute',top:0,left:0}}/>
       <StyleNameProduct>{name}</StyleNameProduct>
       <WrapperReportText>
            <span><span>{rating} </span><StarOutlined style={{fontSize:'10px', color:'yellow'}}/></span>
            <WrapperStyleTextSell> | Đã bán {selled}</WrapperStyleTextSell>
           
       </WrapperReportText>
       <WrapperPriceText>
          {convertPrice(price)}
    
       {/* <WrapperPriceText>{price} */}
        <WrapperDiscountText>
           - {discount || 0} %
        </WrapperDiscountText>
       </WrapperPriceText>
       <WrapperDiscountText>
          {type}
       </WrapperDiscountText>
       <WrapperDiscountText>
          Hàng tồn kho còn {countIntock}
       </WrapperDiscountText>
       
      </WrapperCardStyle>
    </div>
  );
};

export default CardComponent;
