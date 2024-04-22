import { Image } from 'antd'
import React, { useEffect, useState } from 'react'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputFormComponent/InputForms'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from '../SignInPage/syle'
import SignIn from '../../assets/images/signin.png'
import { useNavigate } from 'react-router-dom'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import * as UserService from '../../services/UserService.js'
import { useMutation } from 'react-query'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../LoadingComponent/Loading'
import * as Message from '../../Message/Message'
const SignUpPage = () => {
  const [isShowPassword,setIsShowPassword]=useState(false)
  const [isShowConfirmPassword,setIsShowConfirmPassword]=useState(false)
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate()
  const handleNavigateSignIn =()=>{
    navigate('/sign-in');
  }
  const handleOnchangePassword = (value) => {
    setPassword(value)
  }

  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value)
  }
  const handleOnchangeEmail = (e) =>{
    setEmail(e)
    // console.log('handleOnchangeEmail',handleOnchangeEmail);
  }

  const mutation = useMutationHooks(
    data => UserService.signUpUser(data)
  )
   const {data, isLoading,isSuccess,isError} = mutation
   useEffect(()=>{
    if(isSuccess){
      Message.success()
      handleNavigateSignIn()
    }else if(isError){
      Message.error()
    }
   },[isSuccess,isError])
  //  console.log('SIGN UP',mutation);
  const handleSignUp = () =>{
    // console.log('sign-up',email,password,confirmPassword);
    mutation.mutate({
      email,
      password,
      confirmPassword
    })
  }
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
            <InputForm placeholder="password" style={{ marginBottom: '10px' }} type={isShowPassword ? "text" : "password"}
              value={password} 
              onChange={handleOnchangePassword}
              // onChange={handleOnchangePassword}
               />

          </div>
           <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowConfirmPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm placeholder="comfirm password" type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleOnchangeConfirmPassword}
              //  onChange={handleOnchangeConfirmPassword}
            />
          </div>
          {data?.status === 'ERR' && <span style={{color:'red'}}>{data?.message}</span>}
          <Loading isLoading={isLoading}>
                  <ButtonComponent
                        disabled={!email.length || !password.length || !confirmPassword}
                        onClick={handleSignUp}
                        size={40}
                        // bordered={false}
                        // icon={<SearchOutlined />}
                        textButton='Đăng ký'
                        styleTextButton={{ color:'#fff', fontSize:'15px', fontWeight:'700' }}
                        styleButton={{ background:'rgb(255,67,69)',
                            height:'48px',
                            width:'100%',
                            border:'none',
                            borderRadius:'4px',
                            margin:'26px 0 10px'
                        }}
                    />
            </Loading>
                
                    <p>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}>đăng nhập</WrapperTextLight></p>
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

export default SignUpPage