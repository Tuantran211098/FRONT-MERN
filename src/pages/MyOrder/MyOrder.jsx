import { notification } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../LoadingComponent/Loading'
import { convertPrice } from '../../ultils'
import * as OrderServices from './../../services/OrderService'
const MyOrder = () => {
  const user = useSelector(state => state.user)
  const location = useLocation()
  const {state} = location
  console.log('MyOrder user',user,location);

  const [ stateOrder, setStateOrder] = useState({})
    const fetchAllOrderByID = async () =>{
        // console.log('fetchAllOrderByID',id);
        const resp =  await OrderServices.getOrderDetails(state?.id,state?.token)
        console.log('fetchAllOrderByID',resp);
        setStateOrder(resp.data)
         return resp.data
    }
  
// useEffect(()=>{
//   fetchAllOrderByID(user?.id)
// },[user?.access_token])

const mutateCancel = useMutationHooks((data)=>{
  const {id, ...rests} = data
  console.log('respone',id,rests);
  const respone =  OrderServices.cancelProductDetails(id,rests.token,rests.orderItems)
  // console.log('respone',respone);
  return respone
})
const handleCanceOrder = (order) =>{  
  mutateCancel.mutate({id:order?._id, token:user?.access_token,orderItems:order?.orderItems},{
    onSettled:()=>{
      //cái này là khi xóa ở funtion này cần cái data ban đầu refresh lại cái mới
      queryOrder.refetch()
    }
  })
}

const navigate = useNavigate()
const handleDetailsOrder = (id) =>{
  navigate(`/details-order/${id}`,{state:{id,token:state?.token}})
}
 const queryOrder = useQuery({ queryKey: ['my-order'], queryFn: fetchAllOrderByID}, {enabled: state?.id && state?.token })
 const {data:dataDeleteOrder, isLoading: isLoadingOrder, isError: isErrorOrder, isSuccess: isSuccessOrder} = mutateCancel
 const { data, isLoading } = queryOrder
 useEffect(()=>{
  if(isSuccessOrder){
    notification.open({
      message: `${dataDeleteOrder.message}`,
    });
  }
},[isSuccessOrder])

 const renderItems = (data) =>{
    return data?.map(order=>{
      // console.log('dataDeleteOrder',dataDeleteOrder,isLoadingOrder);
      return(
        <>
    <div key={order?._id}> 
                  <img src={order?.image} 
                    style={{
                      width: '70px',    
                      height: '70px', 
                      objectFit: 'cover',
                      border: '1px solid rgb(238, 238, 238)',
                      padding: '2px'
                    }}
                  />
                  <div style={{
                    width: 260,
                    overflow: 'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap',
                    marginLeft: '10px'
                  }}>{order?.name}</div>
                  <span style={{ fontSize: '13px', color: '#242424',marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
                </div>
                </>
      )
    })  
 }
  return(
    <Loading isLoading={isLoadingOrder}>
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      {
     !isLoading? 
        data?.map((order)=>{
          console.log('order success',order);
          return(
            <>
            <div key={order?._id}>
               <div>
                <h1>Name Row {order?._id}</h1>
                 <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
                 <div>
                   <span style={{color: 'rgb(255, 66, 78)'}}>Giao hàng: </span>
                   <span style={{color: 'rgb(90, 32, 193)', fontWeight: 'bold'}}>'Đã giao hàng'</span>
                 </div>
                 <div>
                   <span style={{color: 'rgb(255, 66, 78)'}}>Thanh toán: </span>
                   <span style={{color: 'rgb(90, 32, 193)', fontWeight: 'bold'}}>{order.isPaid ? 'ĐÃ THANH TOÁN':'CHƯA THANH TOÁN'}</span>
                 </div>
               </div>
               {
                  renderItems(order?.orderItems)
               }

               <div>
                 <div>
                   <span style={{color: 'rgb(255, 66, 78)'}}>Tổng tiền: </span>
                   <span 
                     style={{ fontSize: '13px', color: 'rgb(56, 56, 61)',fontWeight: 700 }}
                   >{convertPrice(order?.totalPrice)}</span>
                 </div>
                 <div style={{display: 'flex', gap: '10px'}}>
                 <ButtonComponent
                     onClick={() => handleCanceOrder(order)}
                     size={40}
                     styleButton={{
                         height: '36px',
                         border: '1px solid #9255FD',
                         borderRadius: '4px'
                     }}
                     textButton={'Hủy đơn hàng'}
                     styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                   >
                   </ButtonComponent>
                   <ButtonComponent
                     onClick={() => handleDetailsOrder(order?._id)}
                     size={40}
                     styleButton={{
                         height: '36px',
                         border: '1px solid #9255FD',
                         borderRadius: '4px'
                     }}
                     textButton={'Xem chi tiết'}
                     styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                   >
                   </ButtonComponent>
                 </div>
               </div>
             </div>
         </>
          )
        })
        :
        ''   
       
      }
    </div>
    </Loading>
  )
}

export default MyOrder