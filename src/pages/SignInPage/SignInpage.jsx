import { Divider, Image } from 'antd'
import React, { useEffect, useState } from 'react'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent.jsx'
import InputForm from '../../components/InputFormComponent/InputForms.jsx'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './syle'
import SignIn from '../../assets/images/signin.png'
import { useLocation, useNavigate } from 'react-router-dom'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'

import * as UserService from '../../services/UserService.js'
import { useMutationHooks } from '../../hooks/useMutationHook.js'
import { Button, Spin } from 'antd';
import Loading from '../../LoadingComponent/Loading.jsx'
import { jwtDecode } from "jwt-decode";
import * as Message from '../../Message/Message'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide.js'
const SignInpage = ({}) => {
  const [isShowPassword,setIsShowPassword]=useState(false)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const handleNavigateSignUp = ()=>{
    navigate('/sign-up')
  }
  console.log('handleNavigateSignUp location',location);
  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }
  const handleOnchangePassword = (e) =>{
    setPassword(e)
  }

  //check react query 
  const mutationSignIn = useMutationHooks(
    data =>UserService.loginUser(data)
  )
   
  // handle function sign in page
  const handleSignIn =() =>{
    // console.log('log',email,password);
    mutationSignIn.mutate({
      email,
      password
     })
  }
  const {data,isLoading,isSuccess,isError} = mutationSignIn
  const dispatch = useDispatch()
  useEffect(()=>{
    if(isSuccess){
      if(location?.state){
        navigate(location?.state)
      }
      else{
        navigate('/')
      }
      
      localStorage.setItem('access_token',JSON.stringify(data?.access_token ) )
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
      if(data?.access_token){
        const decoded = jwtDecode(data?.access_token);
        if(decoded?.id){
          handleGetDetailsUser(decoded?.id,data?.access_token)
        
        }
      }
    }
  },[isSuccess,isError])
  const handleGetDetailsUser = async (id,token) =>{
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailsUser(id,token)
    dispatch(updateUser({...res?.data,access_token:token,refreshToken}))
    console.log('LOG LẦN 1');
  }
  // console.log('data,isLoading',data,isLoading);
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center', background:'#ccc', height:'100vh'}}>
    <div style={{ width:'800px', height:'445px', borderRadius:'6px', background:'#fff',display:'flex'}}>
      <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>
         <InputForm style={{marginBottom:'10px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail}/>
         {/* <Divider size="large"/> */}
         <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm
              placeholder="password"
              type={isShowPassword ? "text" : "password"}
              // value={password}
              // onChange={handleOnchangePassword}
              value={password} 
              onChange={handleOnchangePassword}
            />
          </div>
          {data?.status === 'ERR' && <span style={{color:'red'}}>{data?.message}</span>}
          {/* <Loading isLoading={isLoading}> */}
                    <ButtonComponent
                        disabled={!email.length || !password.length}
                        onClick={handleSignIn}
                        size={40}
                        // bordered={false}
                        // icon={<SearchOutlined />}
                        textButton='Đăng nhập'
                        styleTextButton={{ color:'#fff', fontSize:'15px', fontWeight:'700' }}
                        styleButton={{ background:'rgb(255,67,69)',
                            height:'48px',
                            width:'100%',
                            border:'none',
                            borderRadius:'4px',
                            margin:'26px 0 10px'
                        }}
                    />
                    {/* </Loading> */}
                    <WrapperTextLight>Quen mật khẩu?</WrapperTextLight>
                    <p>chưa có tài khoản? <span onClick={handleNavigateSignUp}>Tạo tài khoản</span></p>
      </WrapperContainerLeft>
      <WrapperContainerRight>
                <Image src={SignIn} preview={false} style={{width:'203px',height:'203px'}}/>
                <h4>Mua sắm tại Tiki</h4>
                <span>Siêu ưu đãi mỗi ngày</span>
      </WrapperContainerRight>
    </div>
    </div>
  )
}

export default SignInpage