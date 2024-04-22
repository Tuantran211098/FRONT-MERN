import {Button, Checkbox, Form, Steps } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
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
import Loading from '../../LoadingComponent/Loading';
import { updateUser } from '../../redux/slides/userSlide';
import StepProcess from '../../components/Steps/Step';

const OrderPage = () => {
  const navigate = useNavigate()
  const order = useSelector(state => state.order)
  const user = useSelector(state => state.user)
  const [ listChecked, setListCheck] = useState([])
  console.log('order',order);
  const dispatch = useDispatch()
  const [isOpenModalUpdateInfo,setIsOpenModalUpdateInfo] = useState('')
  const [form] = Form.useForm();
  const [stateUserDetails, setstateUserDetails] = useState({
    name: '',
    phone: '',
    address:'',
    city:''
});
  const handleChangeCount = (type,idProduct,limit) =>{
    if(type === "increase"){
      console.log('max',limit);
      if(!limit){
        dispatch(increaseAmount({idProduct:idProduct}))
      }
    }else{
      // console.log("decrease");
      if(!limit){
        dispatch(decreaseAmount({idProduct:idProduct}))
      }
     
    }
   
    // console.log('type,idProduct',type,idProduct); 
  }
  const handleDeleteOrder = (idProduct,name) =>{
    notification.open({
      message: `Xóa sản phẩm ${name} thành công`,
      description:
        'Hãy tận hưởng giấy phút mua sắm cùng Mern Stack nhé!',
     
    });
    dispatch(removeOrderProduct({idProduct:idProduct}))
   }
   console.log('listChecked',listChecked);
   const onChange = (e) =>{
    
    
     console.log('onChange',e.target.value);
    if(listChecked.includes(e.target.value)){
      // console.log('listChecked 1',listChecked);
      const newListChecked = listChecked?.filter(items => items !== e.target.value)
      setListCheck(newListChecked)
      // console.log('listChecked 2',listChecked);
    }else{
      // console.log('listChecked new',listChecked);
      setListCheck([...listChecked,e.target.value ])
    }
   }
   const handleOnchangeCheckAll = (e) =>{
    // console.log('e.target',e.target);
    if(e.target.checked){
      const newlistChecked=[]
      order?.orderItems.forEach(items=>{
        newlistChecked.push(items?.product)
      })
      setListCheck(newlistChecked)
      // console.log('newlistChecked',newlistChecked);
    }else{
      setListCheck([])
    }
   }

   //
   const handleRemoveAllOrder = () =>{
    console.log('handleRemoveAllOrder ngoài');
    if(listChecked?.length > 0){
      console.log('handleRemoveAllOrder trong');
      dispatch(removeAllOrderProduct({idProducts:listChecked}))
      
    }else{
      notification.open({
        message: `Xóa sản phẩm không thành công`,
        description:
          'Vui lòng chọn 1 sản phẩm để xóa!',
       
      });
    }
     
   }
  const TooltipText = (items) =>{
      return(
        <>
        <h1>{items.name}</h1>
        <span><strong style={{color:'red',fontWeight:'700'}}>{items.price}</strong></span>
        <p>{items.descript}</p>
        </>
      )
  }
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
    console.log('priceMemo',priceMemo);
   
    if(priceMemo >= 200000 && priceMemo <= 499000){
      return 10000
    }
    else if(priceMemo == 0 && order?.orderItemSelected.length === 0 || priceMemo > 500000){
      return 0
    }
    else{
      return 20000
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

  useEffect(()=>{
    dispatch(selectedOrder({listChecked}))
  },[listChecked])
  const handleAddCart = () =>{
   
    console.log('handleAddCart',user,order);
  
    if(!user?.name || !user?.address || !user?.city || !user?.phone){
      
        setIsOpenModalUpdateInfo(true)
    }
    else if(!order?.orderItemSelected?.length){
      console.log('order?.orderItemSelected');
      notification.open({
        message: 'Vui lòng chọn sản phẩm trước khi tiếp tục',
        description:
          'Hãy tận hưởng giấy phút mua sắm cùng Mern Stack nhé!',
       
      });
      setIsOpenModalUpdateInfo(false)
      
    }else{
      navigate('/PaymentPay')
    }
  }


  const handleOnchangeDetails = (e) =>{
    // console.log('handleOnchangeDetails', [e.target.name], e.target.value);
    setstateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  
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
  const handleChangeAddr = () =>{
    setIsOpenModalUpdateInfo(true)
  }

  const itemsDelivery = [
    {
      title: '20.000 VND',
      description: 'Dưới 200.000 VND',
    },
    {
      title: '10.000 VND',
      description: 'Từ 200.000 VND đến dưới 500.000 VND',
    },
    {
      title: 'Free ship',
      description : 'Trên 500.000 VND',
    },
  ]
  console.log('deleveryMemo',typeof(deleveryMemo));
  return (
    <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
      <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
        <h3 style={{fontWeight: 'bold'}}>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
            <h4>Phí giao hàng</h4>
            <StepProcess  items={itemsDelivery} current={deleveryMemo === 10000 
                ? 1 : deleveryMemo === 20000 ? 0 
                : order?.orderItemSelected.length === 0 ? 2 : 2}/>
            <WrapperStyleHeader>
                <span style={{display: 'inline-block', width: '390px'}}>
                  {/* <CustomCheckbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></CustomCheckbox> */}
                  <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></Checkbox>
                  <span> Tất cả {order?.orderItems.length} sản phẩm</span>
                </span>
                <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <DeleteOutlined style={{cursor: 'pointer'}} onClick={handleRemoveAllOrder}/>
                </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
           {/* loop items */}
             {
              order?.orderItems.map(items=>{
                console.log('orderDetails', items);
                return(
                  <WrapperItemOrder key={items?.product}>
                  <div style={{width: '390px', display:  'flex', alignItems: 'center', gap: 4}}> 
                    {/* <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></CustomCheckbox> */}
                    <Checkbox onChange={onChange} value={items?.product} checked={listChecked.includes(items?.product)}></Checkbox>
                    <img src={items.image} style={{width: 'calc(50% - 90px - 50px)', objectFit: 'contain'}}/>
                    <Tooltip placement="bottomLeft" title={TooltipText(items)}>
                      <div style={{
                        width: 260,
                        overflow: 'hidden',
                        textOverflow:'ellipsis',
                        whiteSpace:'nowrap'
                      }}>{items.name}</div>
                    </Tooltip>
                  </div>
                  <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span>
                      {/* <span style={{ fontSize: '13px', color: '#242424' }}>{items?.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}).replace("VND", "")}</span> */}
                      <span style={{ fontSize: '13px', color: '#242424' }}>{items?.price}</span>
                    </span>
                    <WrapperCountOrder>
                      <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={()=>handleChangeCount('decrease',items?.product,items?.amount === 1)}>
                          <MinusOutlined style={{ color: '#000', fontSize: '10px' }}  />
                      </button>
                      <WrapperInputNumber defaultValue={items?.amount} value={items?.amount} size="small" min={1} max={items?.countIntock}/>
                      <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={()=>handleChangeCount('increase',items?.product, items?.amount === items?.countIntock)}>
                          <PlusOutlined style={{ color: '#000', fontSize: '10px' }}  />
                      </button>
                    </WrapperCountOrder>
                    <span style={{color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500}}>{(items?.price * items?.amount)}</span>
                    <DeleteOutlined style={{cursor: 'pointer'}} onClick={()=> handleDeleteOrder(items?.product,items?.name)}/>
                  </div>
                </WrapperItemOrder>
                )
              })
             }
               
           
            </WrapperListOrder>
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
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{`${convertPrice(priceDiscountMemo)}`}</span>
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
            <ButtonComponent
             onClick={handleAddCart}
              size={40}
              styleButton={{
                  background: 'rgb(255, 57, 69)',
                  height: '48px',
                  width: '320px',
                  border: 'none',
                  borderRadius: '4px'
              }}
              textButton="Mua Hàng"
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
    </div>
  )
}

export default OrderPage