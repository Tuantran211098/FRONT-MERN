import {Button, Checkbox, Form, Radio } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRadio, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'

import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, selectedOrder,removeOrderProduct } from '../../redux/slides/orderSlide';
import {  notification,Tooltip } from 'antd';
import { convertPrice } from '../../ultils';
import InputComponent from '../../components/InputComponent/InputComponent';

import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from './../../services/UserService'
import * as OrderServices from './../../services/OrderService'
import * as PaymentServices from './../../services/PaymentService'
import Loading from '../../LoadingComponent/Loading';
import { updateUser } from '../../redux/slides/userSlide';
import { PayPalButton } from "react-paypal-button-v2";
const PaymentPay = () => {
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

  const priceMemo = useMemo(()=>{
    const result = order?.orderItemSelected?.reduce((total, cur) =>{
      //  console.log('total',total,'cur', cur);
      return total + ((cur.price * cur.amount))
    },0)
    // console.log('result',result);
    return result
  },[order])
  const priceDiscountMemo = useMemo(()=>{
    const result = order?.orderItemSelected?.reduce((total, cur) =>{
      //  console.log('total',total,'cur', cur);
      //  return total + ((cur.discount * cur.amount)/100)  
      const totalDiscount = cur.discount ? cur.discount : 0
      console.log('totalDiscount',totalDiscount,cur.amount);
      return total + (priceMemo * (totalDiscount * cur.amount) /100 )
    },0)
    if(Number(result)){
      return result
    }
    //  console.log('priceDiscountMemo',result);
    return 0
  },[order])

  const deleveryMemo = useMemo(()=>{
    if(priceMemo >= 1000000){
      return 20000
    }
    else if(priceMemo == 0){
      return 0
    }
    else{
      return 30000
    }
    // const result = order?.orderItems?.reduce((total, cur) =>{
    //    console.log('total',total,'cur', cur);
    //   return total + ((cur.discount * cur.amount))
    // },0)
    //  console.log('priceDiscountMemo',result);
    
  },[priceMemo])
  const priceTotalMemo = useMemo(()=>{

    let percent = priceMemo - priceDiscountMemo
    console.log('percent',priceMemo,priceDiscountMemo);
    return  Number(percent) +  deleveryMemo
  },[priceMemo,priceDiscountMemo,deleveryMemo])
  const mutationAddOrder = useMutationHooks(
    async (data) => {
      const {
        token,
        ...rests } = data
        console.log('mutation data',data);
      const resspone =  await OrderServices.createOrder(token,{ ...rests })
        // const results =  Promise.all(res)
        console.log('mutation resspone',resspone);
      // return res
    },
  )

  const handleAddOrder =  () =>{
     console.log('handleAddOrder',user,order);
    if(user.access_token && order.orderItemSelected){
      console.log('them thành công');
       mutationAddOrder.mutate(
        {
          token:user?.access_token,
          orderItems:order?.orderItemSelected,
          fullName:user?.name,
          address:user?.address,
          phone:user?.phone,
          city:user?.city,
          paymentMethod:payment,
          itemsPrice:priceMemo,
          shippingPrice:deleveryMemo,
          totalPrice:priceTotalMemo,
          user:user?.id,
          email:user?.email
        })
    }else{
      console.log('them không thành công');
      notification.warning({
        message: 'Vui lòng thêm vào giỏ hàng', 
      });
      setTimeout(() => {
        navigate('/order')
      }, 3000);
     
    }
   
  }


  const handleOnchangeDetails = (e) =>{
    // console.log('handleOnchangeDetails', [e.target.name], e.target.value);
    setstateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  
  const {data:dataOrder, isLoading: isLoadingOrder, isError: isErrorOrder, isSuccess: isSuccessOrder} = mutationAddOrder
  console.log('isLoadingOrder',dataOrder,isLoadingOrder,isSuccessOrder);
  useEffect(() => {
    console.log('useEffect isLoadingOrder khong');
    if (isLoadingOrder) {
          console.log('useEffect isLoadingOrder do');
        const arrOrder = []
        
        order?.orderItemSelected.forEach(element => {
          arrOrder.push(element.product)
        });
          dispatch(removeAllOrderProduct({idProducts:arrOrder}))
          notification.open({
            message: 'Đặt hàng thành công nhé', 
          });
          // setTimeout(() => {
          //   navigate('/orderSuccess',{
          //     state:{
          //       delivery,
          //       payment,
          //       order:order?.orderItemSelected,
          //       priceTotalMemo:priceTotalMemo
          //     }
          //   })
          // }, 8000);
       
    } else if(dataOrder?.status === 'ERR') {
        // console.log('isError',isError);
        notification.warning({
          message: 'Đặt hàng không thành công nhé', 
        });
    }
}, [isLoadingOrder])
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
  const handleUpdateInforUser = (e) =>{
    console.log('do',stateUserDetails);
    const { name,address,city,phone} =  stateUserDetails
       if(name && address && city && phone){
        mutationUpdate.mutate({ 
          id:user?.id, 
          token: user?.access_token, 
          ...stateUserDetails
      },{
        onSuccess:()=>{
          dispatch(updateUser(stateUserDetails))
          setIsOpenModalUpdateInfo(false)
        }
      })
       }
  }
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
  const handleCancleUpdateInfo = () =>{
    setIsOpenModalUpdateInfo(false)
     setstateUserDetails({
        name: '',
        email: '',
        phone: '',
        city: ''
    })
    form.resetFields();
  }
  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  const handleChangeAddr = () =>{
    setIsOpenModalUpdateInfo(true)
  }
  const handleDilivery = (e) =>{

    setDelivery(e.target.value)
  }
  const handlePayment = (e) =>{

    setPayment(e.target.value)
  }
  const [sdkReady,setSdkReady] = useState(false)
  const addPaypalScript = async () =>{
    const {data} = await PaymentServices.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true
    script.onload = () =>{
      setSdkReady(true)
    }
    document.body.appendChild(script)
    // console.log('data',data);
  }
  useEffect(()=>{
    if(!window.paypal){
      addPaypalScript()
    }else{
      setSdkReady(true)
    }
   
  },[])
  const onSuccessPayMent = (details,data) =>{
  console.log('details,data',details,data);
    mutationAddOrder.mutate(
      {
        token:user?.access_token,
        orderItems:order?.orderItemSelected,
        fullName:user?.name,
        address:user?.address,
        phone:user?.phone,
        city:user?.city,
        paymentMethod:payment,
        itemsPrice:priceMemo,
        shippingPrice:deleveryMemo,
        totalPrice:priceTotalMemo,
        user:user?.id,
        isPaid:true,
        paidAt:details?.update_time,
        email:user?.email
      })
      // setTimeout(() => {
      //   navigate('/orderSuccess',{
      //     state:{
      //       delivery,
      //       payment,
      //       order:order?.orderItemSelected,
      //       priceTotalMemo:priceTotalMemo,
      //       isPaid:true
      //     }
      //   })
      // }, 8000);
      // return fetch("/paypal-transaction-complete", {
      //   method: "post",
      //   body: JSON.stringify({
      //     orderID: data.orderID
      //   })
      // });
      
  }
  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      {/* <Loading isLoading={isLoadingOrder != undefined}> */}
      <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
        <h3 style={{fontWeight: 'bold'}}>Thanh toán</h3>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
          <WrapperRadio onChange={handleDilivery} value={delivery}> 
                    <Radio  value="fast"><span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                    <Radio  value="gojek"><span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                </WrapperRadio>
                <WrapperInfo>
                <div>
                  <label>Chọn phương thức thanh toán</label>
                  <WrapperRadio onChange={handlePayment} value={payment}> 
                    <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                    <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
          </WrapperLeft>
          <WrapperRight>
            <div style={{width: '100%'}}>
              <WrapperInfo>
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{fontWeight: 'bold'}}>{`${user?.address} - ${user?.city}`} </span>
                  <span onClick={handleChangeAddr} style={{color: '#9255FD', cursor:'pointer'}}>Thay đổi</span>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Tạm tính</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Giảm giá</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{`${convertPrice(priceDiscountMemo)} %`}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Phí giao hàng</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(deleveryMemo)}</span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{display:'flex', flexDirection: 'column'}}>
                  <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(priceTotalMemo)}</span>
                  <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
            </div>
            {
              payment === 'paypal' && sdkReady ? (
                <PayPalButton
                    amount={Math.round(priceTotalMemo)}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={onSuccessPayMent}
                    onError={()=>{
                      alert("ERROR " )
                    }}
                 
                  />
              )
              : ''
            }
            <ButtonComponent
             onClick={handleAddOrder}
              size={40}
              styleButton={{
                  background: 'rgb(255, 57, 69)',
                  height: '48px',
                  width: '320px',
                  border: 'none',
                  borderRadius: '4px'
              }}
              textButton="Đặt Hàng"
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
       <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdateInfo} onOk={handleUpdateInforUser}>
     <Loading isLoading={isLoadingUpdated}>

    
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: 'Please input your city!' }]}
            >
              <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please input your  phone!' }]}
            >
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>

            <Form.Item
              label="Adress"
              name="address"
              rules={[{ required: true, message: 'Please input your  address!' }]}
            >
              <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>
            {/* <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item> */}
          </Form>
          </Loading>
      </ModalComponent> 
      {/* </Loading> */}
    </div>
  )
}

export default PaymentPay