import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import * as OrderService from '../../services/OrderService'
import Loading from '../../LoadingComponent/Loading';
import { orderConstant } from '../../orderConstant';
import { convertPrice } from '../../ultils';
const DetailsOrder = props => {
    const location = useLocation();
    const params = useParams()
    console.log('params',params);
    const user = useSelector(state => state.user)
    const getDetailsOrder = async () =>{
        console.log('do',user,location);
        const res = await OrderService.getOrderDetailItems(params?.id,location.token)
        console.log('getDetailsOrder',res);
        return res.data
    }
    useEffect(()=>{
        console.log('params?.id',params?.id);
        getDetailsOrder()
    },[params?.id])
    const queryDetailsOrder = useQuery({ queryKey: ['products'],queryFn:getDetailsOrder},{ enabled:params?.id})
    const {data,isLoading} = queryDetailsOrder
    console.log('loaction',data,isLoading);
    const priceMemo = useMemo( () =>{
        const res = data?.orderItems?.reduce((total, item) => (item.amount * item.price) + total, 0)
        return convertPrice(res)    
    })
  return (
    <div>
        <Loading isLoading={isLoading}>
            <div>Thành Công {orderConstant.payment[data?.paymentMethod]} </div>
            <div>Địa chỉ: {`${data?.shippingAddress?.address} - ${data?.shippingAddress?.city}`}</div> 
             <div>Trạng thái thanh toán: {data?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</div>
            <div>Trạng thái vận chuyển: {data?.isDelivered ? "Đã vận chuyển" : "Chưa vận chuyển"}</div>
            <div className="wrap" style={{display:'flex',flexDirection:'column'}}>
            {
                data?.orderItems.map((order)=>{
                    return(
                        <>
                       
                            <div className="block" style={{display:'flex',flexDirection:'row',justifyContent:'space-around', alignItems:'center'}}>
                                <img src={`${order.image}`} class={`${order.image}`} alt="" style={{width:'70px'}}/>
                                <h1>Tên: {order.name}</h1>
                                <h3> Giá: {convertPrice(order?.price)}</h3>
                                <h3>Số lượng: {order.amount}</h3>
                                <h3> Giảm giá: {order?.discount ? convertPrice(order?.discount) : 'O VND'}</h3>
                                
                                
                            </div>
                       
                        </>
                    )
                })
            }
            <div style={{textAlign:'right'}}>Tạm tính: {priceMemo}</div>
            <div class="" style={{textAlign:'right'}}>Tổng cộng: {data?.totalPrice}</div>
            </div>
        </Loading> </div>
  )
}


export default DetailsOrder