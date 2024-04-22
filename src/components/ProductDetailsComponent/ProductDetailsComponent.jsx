import { Col, Image, InputNumber, notification, Rate, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import detaipage from '../../assets/images/detaipage.png'
import detaipageSmall from '../../assets/images/detaipagesmall.png'
import { WrapperAddressProduct, WrapperBtnQualityProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import { StarFilled,PlusOutlined, MinusOutlined } from '@ant-design/icons';
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from 'react-query'
import Loading from '../../LoadingComponent/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useBeforeUnload, useLocation, useNavigate } from 'react-router-dom'
import { addOrder, addOrderProduct } from '../../redux/slides/orderSlide'
import { convertPrice, initFacebookSDK, initFacebookSdk } from '../../ultils'
import LikeButton from '../LikeButtonComponent/LikeButton'
import CommentCpomponent from '../CommentComponent/comment'
const ProductDetailsComponent = ({idProduct}) => {
    const [numProduct,setNumProduct] = useState(1)
    const user = useSelector(state=>state.user)
    const navigate = useNavigate()
    const location = useLocation()
    const order = useSelector(state => state.order)
    const [quantity, setQuantity] = useState(1)
    console.log('location',location);
    const dispatch = useDispatch()
   
    console.log('idProduct',idProduct);
    const fetchGetDetailsProduct = async (context) => {
        
        const id = context?.queryKey && context?.queryKey[1]
        if(id){
            const res = await ProductService.getDetailsProduct(id)
            setQuantity(res.data.countIntock)
            return res.data
        }
        
        // console.log('fetchGetDetailsProduct',res);
        // if (res?.data) {
        //     // setStateProductDetails({
        //     //     name: res?.data.name,
        //     //     image: res?.data.image,
        //     //     type: res?.data.type,
        //     //     price: res?.data.price,
        //     //     countIntock: res?.data.countIntock,
        //     //     rating: res?.data.rating,
        //     //     description: res?.data.description
        //     // })
        //     // setImageDefault(res?.data.image)
        // }
        // setIsLoadingUpdate(false)
      
    }
    useEffect(()=>{
        initFacebookSdk()
    },[])
    const {isLoading, data:productDetails}= useQuery(['product-details',idProduct],fetchGetDetailsProduct,{enabled:!!idProduct})
    console.log('productDetails',productDetails);
    const onChange = (value) =>{
        console.log('onChange',value,typeof value);
        if(value < 1){
            console.log('log 1',value);
             setNumProduct(1)
        }else if(value > quantity){
            console.log('log 2',value);
              setNumProduct(1)
        }else{
            console.log('log 3',value);
              setNumProduct(value)
        }
         console.log('ngoài',value);
        // setNumProduct(Number(value))
    }
    const renderStar = (num) =>{
        // console.log('num',numlength ,typeof num);
        const html ="";
        for(var i = 0 ; i< num ; i++){
            html += <StarFilled style={{fontSize:'12px',color:'rgb(253,216,54)'}}/>
        }
        return html;
    }
    const handleChangeCount = (type) =>{
        console.log('handleChangeCount',numProduct);
        if(type === 'increase'){
            if(numProduct < quantity){
                setNumProduct(Number(numProduct + 1))
            }
         
        }else{
            if(numProduct > 1 ){
                setNumProduct(Number(numProduct - 1))
            }
           
        }
    }
    console.log('be increase',numProduct);
    const handleAddOrderProduct = () =>{
        console.log('handleAddOrderProduct user', order.orderItems);
        if(!user?.id){
            navigate('/sign-in',{state:location.pathname})
        }else{
            console.log('productDetails',productDetails);
            if(quantity > 0){
                dispatch(addOrderProduct({
                    orderItems:{
                        name:productDetails?.name,
                        amount:numProduct,
                        image:productDetails?.image,
                        price:productDetails?.price,
                        product:productDetails?._id,
                        descript:productDetails?.description,
                        discount:productDetails?.discount,
                        countIntock:productDetails?.countIntock
                    }
                }))
            }else{
                notification.open({
                    message: `Sản phẩm ${productDetails?.name} khong đủ hàng`,
                  
                  });
            }
            
        }
       
        console.log('handleAddOrderProduct user',user);
    }
  return (
    <Loading isLoading={isLoading}>
        <Row style={{padding:'16px',background:'#fff'}}>
            <Col span={10} style={{borderRight:'1px solid #ccc'}}>
                <Image src={productDetails?.image} preview={false} />
                <Row style={{paddingTop:'16px', justifyContent:'space-between'}}>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={detaipageSmall} preview={false}/>
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={detaipageSmall} preview={false}/>
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={detaipageSmall} preview={false}/>
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={detaipageSmall} preview={false}/>
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={detaipageSmall} preview={false}/>
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={detaipageSmall} preview={false}/>
                    </WrapperStyleColImage>
                </Row>
            </Col>
            <Col span={14} style={{paddingLeft:'10px'}}>
                <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                <div>
                        <Rate disabled defaultValue={productDetails?.rating} />
                    {/* {
                        renderStar(productDetails?.rating)
                    } */}
                    {/* <StarFilled style={{fontSize:'12px',color:'rgb(253,216,54)'}}/>
                    <StarFilled style={{fontSize:'12px',color:'rgb(253,216,54)'}}/>
                    <StarFilled style={{fontSize:'12px',color:'rgb(253,216,54)'}}/> */}
                    <WrapperStyleTextSell> | Đã bán 1000</WrapperStyleTextSell>
                </div>
                <WrapperPriceProduct>
                    <WrapperPriceTextProduct>
                    {convertPrice(productDetails?.price)}
                    </WrapperPriceTextProduct>
                </WrapperPriceProduct>
                <WrapperAddressProduct>
                        <span>Giao đến</span>
                        <span className="address">{user?.address && user?.address || "..."}</span>
                        <span className="change-address">Đổi địa chỉ</span>
                    </WrapperAddressProduct>
                    <LikeButton dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/" : window.location.href}/>
                    <div style={{margin:'10px 0 20px'}}>
                        <div style={{marginBottom:'20px'}}>Số lượng:</div>
                        <WrapperQualityProduct>  
                            <button style={{border:'none',background:'transparent'}}  onClick={()=>handleChangeCount('decrease')}>
                                <MinusOutlined style={{color:'#000',fontSize:'20px'}}/>
                            </button>
                            <WrapperInputNumber value={numProduct} onChange={(e)=>onChange(e)} size="small"/>
                            <button style={{border:'none',background:'transparent'}} onClick={()=>handleChangeCount('increase')}>
                                <PlusOutlined  style={{color:'#000',fontSize:'20px'}}/>
                            </button>
                        </WrapperQualityProduct>
                    </div>
                    <div style={{display:'flex',alignItems:'center', gap:'12px'}}>
                        <ButtonComponent
                            onClick={handleAddOrderProduct}
                            size={40}
                            bordered={false}
                            // icon={<SearchOutlined />}
                            textButton='Chọn Mua'
                            styleTextButton={{ color:'#fff', fontSize:'15px', fontWeight:'700' }}
                            styleButton={{ background:'rgb(255,67,69)',
                                height:'48px',
                                width:'220px',
                                border:'none',
                                borderRadius:'4px',
                            }}
                        />
                        <ButtonComponent
                            size={40}
                            bordered={false}
                            // icon={<SearchOutlined />}
                            textButton='Mua trả sau'
                            styleTextButton={{ color:'rgb(13,92,182)', fontSize:'15px', fontWeight:'700' }}
                            styleButton={{ background:'transparent',
                                height:'48px',
                                width:'220px',
                                border:'1px solid rgb(13,92,182)',
                                borderRadius:'4px',
                            }}
                        />
                    </div>
            </Col>
            <CommentCpomponent dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/comments#configurator" : window.location.href} width="1270"/>
        </Row>
    </Loading>
  )
}

export default ProductDetailsComponent;