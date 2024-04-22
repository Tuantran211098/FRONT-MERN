import { Image } from "antd";
import React, { Component } from "react";
import Slider from "react-slick";
const SliderComponent = ({arrImages}) => {
  console.log(arrImages);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay:true
  };
  return (
    <div>
      <Slider {...settings}>
          {
            arrImages.map((image) =>{
              return(
                <Image key={image} src={image} preview={false} width="100%" height="274px"/>
              )
          })
        }
        
      </Slider>
    </div>
  ) 
}

export default SliderComponent