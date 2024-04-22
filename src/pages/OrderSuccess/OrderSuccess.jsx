import {Button, Checkbox, Form, Radio } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRadio, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'

import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, selectedOrder,removeOrderProduct } from '../../redux/slides/orderSlide';
import {  notification,Tooltip } from 'antd';
import { convertPrice } from '../../ultils';
import InputComponent from '../../components/InputComponent/InputComponent';

import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import Loading from '../../LoadingComponent/Loading';
import { updateUser } from '../../redux/slides/userSlide';
import { orderConstant } from '../../orderConstant';

const OrderSuccess = () => {
  const navigate = useNavigate()
  const order = useSelector(state => state.order)

  const user = useSelector(state => state.user)
  const [ listChecked, setListCheck] = useState([])
  console.log('order ngoài',order);
  const dispatch = useDispatch()
  const [isOpenModalUpdateInfo,setIsOpenModalUpdateInfo] = useState('')
  const [form] = Form.useForm();
  const [stateUserDetails, setstateUserDetails] = useState({
    name: '',
    phone: '',
    address:'',
    city:''
  });
 


   console.log('listChecked',listChecked);

  
  



  const mutationAddOrder = useMutationHooks((data)=>{
      const {token, ...rests} = data
      // console.log('mutationAddOrder data',rests);
      const respone = OrderService.createOrder(token,{...rests})
       return respone
  })
  const {data:dataOrder, isLoading: isLoadingOrder, isError: isErrorOrder, isSuccess: isSuccessOrder} = mutationAddOrder
  useEffect(() => {
    if (isSuccessOrder && dataOrder?.status === 'OK') {
        // console.log('success');
      
          notification.open({
            message: 'Đặt hàng thành công nhé', 
          });
    } else if (dataOrder?.status === 'ERR') {
        // console.log('isError',isError);
        notification.warning({
          message: 'Đặt hàng không thành công nhé', 
        });
    }
}, [isLoadingOrder,isErrorOrder])
  const mutationUpdate = useMutationHooks(
    (data) => {
         console.log('useMutationHooks', data);
        const {
             id, token, ...rests
        } = data

        const response = UserService.updateUser(
            id,
            { ...rests },
            token
           
        )
  
        return response
    }
)

  const { data: dataUpdate, isLoading: isLoadingUpdated, isError: isErrorUpdated, isSuccess: isSuccessUpdated } = mutationUpdate

  useEffect(()=>{
    form.setFieldsValue(stateUserDetails)
  },[form,stateUserDetails])
  // console.log('stateUserDetails',stateUserDetails);
  useEffect(()=>{
    if(isOpenModalUpdateInfo){
      setstateUserDetails({
        ...stateUserDetails,
        city:user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      
      })
    }
  },[isOpenModalUpdateInfo])

  const location = useLocation();
  console.log('location',location);
  const {state} = location
  const TooltipText = (items) =>{
    return(
      <>
      <h1>{items.name}</h1>
      <span><strong style={{color:'red',fontWeight:'700'}}>{items.price}</strong></span>
      <p>{items.descript}</p>
      </>
    )
}
  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
   
      <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
        <h3 style={{fontWeight: 'bold'}}>Đơn hàng đã đặt thành công</h3>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
                <WrapperInfo>
                    <div>
                      <label>Phương thức giao hàng</label>
                      <div>
                        <span style={{color: '#ea8500', fontWeight: 'bold'}}>{orderConstant.delivery[state?.delivery]}</span> 
                      </div>
                    </div>
                    </WrapperInfo>  
                <WrapperInfo>
                  <div>
                      <label>Phương thức thanh toán</label>
                      <div>
                        <span style={{color: '#ea8500', fontWeight: 'bold'}}>{orderConstant.payment[state?.payment]}</span> 
                      </div>
                    </div> 
              </WrapperInfo>
              <WrapperInfo>
                {
                  state.order?.map((order)=>{
                    return(
                      <>
                      <WrapperItemOrder>
                      <div style={{width: '390px', display: 'flex', alignItems: 'center', gap: 4}}> 
                        {/* <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></CustomCheckbox> */}
                       
                        <img src={order.image} style={{width: 'calc(50% - 90px - 50px)', objectFit: 'contain'}}/>
                        <Tooltip placement="bottomLeft" title={TooltipText(order)}>
                          <div style={{
                            width: 260,
                            overflow: 'hidden',
                            textOverflow:'ellipsis',
                            whiteSpace:'nowrap'
                          }}>{order.name}</div>
                          
                        </Tooltip>
                      </div>
                      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <span>
                        <span style={{ fontSize: '13px', color: '#242424' }}>Giá: {order?.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}).replace("VND", "")}</span> 
                          {/* <span style={{ fontSize: '13px', color: '#242424' }}>{items?.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}).replace("VND", "")}</span> */}
                        </span>
                        <span>
                          <span style={{ fontSize: '13px', color: '#242424' }}>Số lượng: {order.amount}</span> 
                        </span>
                       
                        
                        {/* <WrapperCountOrder>
                          <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={()=>handleChangeCount('decrease',items?.product)}>
                              <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                          </button>
                          <WrapperInputNumber defaultValue={1} value={items?.amount} size="small" min={1} max={100}  />
                          <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={()=>handleChangeCount('increase',items?.product)}>
                              <PlusOutlined style={{ color: '#000', fontSize: '10px' }}/>
                          </button>
                        </WrapperCountOrder> */}
                        {/* <span style={{color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500}}>{(items?.price * items?.amount).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</span> */}
                        
                      </div>
                     </WrapperItemOrder>
                     <span>
                          <span style={{ fontSize: '13px', color: 'red' }}>Tổng tiền:  {convertPrice(state?.priceTotalMemo)}</span> 
                        </span>
                     </>
                    )
                  })
                }
              
              </WrapperInfo>
          </WrapperLeft>
          
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess