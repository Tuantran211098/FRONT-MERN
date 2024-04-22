import { Badge, Col, Popover, Row, Spin } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import { WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from "./style";
import { UserOutlined,ShoppingCartOutlined, CaretDownOutlined } from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd/es/radio";
import * as UserService from '../../services/UserService'
import { resetUser } from "../../redux/slides/userSlide";
import Loading from '../../LoadingComponent/Loading.jsx'
import { searchProduct } from "../../redux/slides/productSlide";
const HeaderComponent = (props) => {
  const {isHiddenSearch = false, isHiddenCart = false} = props
  console.log("isHiddenSearch", isHiddenCart);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading,setLoading] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [ userName, setUserName] = useState('')
  const [ userAvatar, setUserAvatar] = useState('')
  const [search,setSearch] = useState('')
  const order = useSelector((state) => state.order)
  const handleNavigitionLogin = () =>{
    navigate("/sign-in")
  }
  const user = useSelector((state) => state.user)
  console.log('HeaderComponent',user);
  useEffect(()=>{
    setLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setTimeout(() => {
      setLoading(false)
    }, 3000);
  },[user?.name,user?.avatar])
  const handleLogout = async () =>{
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
    }, 3000);
    setLoading(true)
    await UserService.logoutUser()
    localStorage.removeItem('access_token');
    dispatch(resetUser())
    setLoading(false)
  }
  
  const content = (
    <div>
     
      <p onClick={()=> navigate('/profile-user')}>Thông tin người dùng</p>
      <p  onClick={()=> navigate('/my-order',{
        state:{
          id:user?.id,
          token:user?.access_token
        }
      })}>Đơn hàng của tôi</p>
      {
        user?.isAdmin &&   <p onClick={()=> navigate('/system/admin')}>Quản lí hệ thống</p>
      }
     <p onClick={handleLogout}>ĐĂNG XUẤT</p>
    </div>
  );
  const onSearch = (e) =>{
    setSearch(e.target.value)
    console.log('e.target.value',e.target.value);
    dispatch(searchProduct(e.target.value))
  }
  return (
    <div>
      <WrapperHeader gutter={15} style={{justifyContent:isHiddenSearch && isHiddenCart ? 'space-between':'unset'}}>
        <Col span={6}>
          <WrapperTextHeader onClick={()=>navigate('/')}>MERNSTACK</WrapperTextHeader>
        </Col>
        {
          !isHiddenSearch && (
            <Col span={12}>
              <ButtonInputSearch
                placeholder="input search text"
                size='large'
                textButton="Tìm kiếm"
                // bordered={false}
                onChange={onSearch}
                enterButton

              />
            </Col>
          )
        }
       
        <Col span={6} style={{display:'flex',gap:'20px'}}>
          <Spin spinning={spinning} fullscreen >
            <Loading isLoading={loading}> 
              <WrapperHeaderAccount>
                
                {
                  user?.avatar ? (
                    <img src={userAvatar} style={{
                      height:'50px',
                      width:'50px',
                      borderRadius:'100%',
                      objectFit:'fill'
                    }}/>
                  )
                  :
                  <UserOutlined style={{fontSize:'40px'}}/>
                }
                {user?.access_token ?
                (
                <>
              
                  <div style={{cursor:'pointer'}}
                  >
                    <Popover content={content} trigger="click">
                        <span>{ userName.length ?  userName :  user?.email }</span>
                    </Popover>
                    </div>
                </>
                )
                :
                  <div onClick={handleNavigitionLogin}>
                    <WrapperTextHeaderSmall>ĐĂNG NHẬP/ĐĂNG KÝ</WrapperTextHeaderSmall>
                    <div>
                      <WrapperTextHeaderSmall>Tài khoản </WrapperTextHeaderSmall>
                      <CaretDownOutlined />
                    </div>
                  </div>
                }
              </WrapperHeaderAccount>
            </Loading>
          </Spin>
          {
        !isHiddenCart && (
          <div onClick={()=>navigate('/order')}>
          <Badge count={order?.orderItems.length}>
              <ShoppingCartOutlined style={{fontSize:'30px',color:'#fff'}}/>
          </Badge>
          <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
        </div>
        )
       }
         
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
