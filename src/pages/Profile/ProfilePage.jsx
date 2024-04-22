import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForms from '../../components/InputFormComponent/InputForms'
import  {WrapperHeader,WrapperContentProfile,WrapperLabel, WrapperInput, WrapperUpload}  from './style'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../LoadingComponent/Loading'
import * as Message from '../../Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../ultils'
const ProfilePage = ({}) => {
    const user = useSelector((state) => state.user)
    // console.log('user ProfilePage',user);
    const [ email,setEmail]= useState(user?.email ? user?.email : '')
    const [ name,setName]= useState(user?.name ? user?.name : '')
    const [ phone,setPhone]= useState(user?.phone ? user?.phone : '')
    const [ address,setAddress]= useState(user?.address ? user?.address : '')
    const [ avatar,setAvatar]= useState(user?.avatar ? user?.avatar : '')
    const dispatch = useDispatch()
    useEffect(()=>{
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    },[user])
    useEffect(()=>{
          if(isSuccess){
            Message.success()
            // dispatch()
            handleDetailsGetUser(user?.id,user?.access_token)
        }else if(isError){
            Message.error()
        }
    })
    const handleDetailsGetUser = async (id,token) =>{
        const res = await UserService.getDetailsUser(id,token)
        dispatch(updateUser({...res?.data,access_token:token}))
    }
    const handleOnchangeName = (value) =>{
        setName(value)
    }
    const handleOnchangeEmail = (value) =>{
        setEmail(value)
    }
    const handleOnchangePhone = (value) =>{
        setPhone(value)
    }
   
    const handleOnchangeAddress = (value) =>{
        setAddress(value)
    }
    const handleOnchangeAvatar = async ({fileList}) =>{
      
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj );
          }
        setAvatar(file.preview)
        // console.log(file.preview);
    }
    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests} = data
            UserService.updateUser(id,rests,access_token)
        }
    )
    const { data, isSuccess, isLoading, isError } = mutation;
    const handleUpdate = () =>{     
        mutation.mutate({
            id:user?.id,
            email,phone,name,address,avatar,access_token:user?.token
        })
      
        
        // console.log('update',email,phone,name,address,avatar);
    }
   
  return (
    <div style={{padding: '20px 120px',margin:'0 auto', height:'500px'}}>
        <WrapperHeader>Thông tin người dùng</WrapperHeader>
        <Loading isLoading={isLoading}>
                <WrapperContentProfile>

                    <WrapperInput>
                        <WrapperLabel htmlFor='name'>Name</WrapperLabel>
                        <InputForms id="name" style={{width:'300px'}} placeholder="abc@gmail.com" value={name} onChange={handleOnchangeName}/>
                        <ButtonComponent
                            
                                onClick={handleUpdate}
                                size={40}
                                // bordered={false}
                                // icon={<SearchOutlined />}
                                textButton='Cập nhật'
                                styleTextButton={{ color:'rgb(26,148,255)', fontSize:'15px', fontWeight:'700' }}
                                styleButton={{
                                    height:'30px',
                                    width:'fit-content',
                                    border:'1px solid rgb(26,148,255)',
                                    borderRadius:'4px',
                                    padding:'2px 6px',
                                    // margin:'26px 0 10px'
                                }}
                            />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='email'>Email</WrapperLabel>
                        <InputForms id="email" style={{width:'300px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail}/>
                        <ButtonComponent
                            
                                onClick={handleUpdate}
                                size={40}
                                // bordered={false}
                                // icon={<SearchOutlined />}
                                textButton='Cập nhật'
                                styleTextButton={{ color:'rgb(26,148,255)', fontSize:'15px', fontWeight:'700' }}
                                styleButton={{
                                    height:'30px',
                                    width:'fit-content',
                                    border:'1px solid rgb(26,148,255)',
                                    borderRadius:'4px',
                                    padding:'2px 6px',
                                    // margin:'26px 0 10px'
                                }}
                            />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='phone'>Phone</WrapperLabel>
                        <InputForms id="phone" style={{width:'300px'}} placeholder="abc@gmail.com" value={phone} onChange={handleOnchangePhone}/>
                        <ButtonComponent
                            
                                onClick={handleUpdate}
                                size={40}
                                // bordered={false}
                                // icon={<SearchOutlined />}
                                textButton='Cập nhật'
                                styleTextButton={{ color:'rgb(26,148,255)', fontSize:'15px', fontWeight:'700' }}
                                styleButton={{
                                    height:'30px',
                                    width:'fit-content',
                                    border:'1px solid rgb(26,148,255)',
                                    borderRadius:'4px',
                                    padding:'2px 6px',
                                    // margin:'26px 0 10px'
                                }}
                            />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='address'>Address</WrapperLabel>
                        <InputForms id="address" style={{width:'300px'}} placeholder="abc@gmail.com" value={address} onChange={handleOnchangeAddress}/>
                        <ButtonComponent
                            
                                onClick={handleUpdate}
                                size={40}
                                // bordered={false}
                                // icon={<SearchOutlined />}
                                textButton='Cập nhật'
                                styleTextButton={{ color:'rgb(26,148,255)', fontSize:'15px', fontWeight:'700' }}
                                styleButton={{
                                    height:'30px',
                                    width:'fit-content',
                                    border:'1px solid rgb(26,148,255)',
                                    borderRadius:'4px',
                                    padding:'2px 6px',
                                    // margin:'26px 0 10px'
                                }}
                            />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='avatar'>Avatar</WrapperLabel>
                        <WrapperUpload onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </WrapperUpload>
                        {avatar && (
                            <img src={avatar} style={{
                                height:'100px',
                                width:'100px',
                                objectFit:'contain'
                            }}/>
                        )}
                        {/* <InputForms id="avatar" style={{width:'300px'}} placeholder="abc@gmail.com" value={avatar} onChange={handleOnchangeAvatar}/> */}
                        <ButtonComponent
                            
                                onClick={handleUpdate}
                                size={40}
                                // bordered={false}
                                // icon={<SearchOutlined />}
                                textButton='Cập nhật'
                                styleTextButton={{ color:'rgb(26,148,255)', fontSize:'15px', fontWeight:'700' }}
                                styleButton={{
                                    height:'30px',
                                    width:'fit-content',
                                    border:'1px solid rgb(26,148,255)',
                                    borderRadius:'4px',
                                    padding:'2px 6px',
                                    // margin:'26px 0 10px'
                                }}
                            />
                    </WrapperInput>
                
                </WrapperContentProfile>    
        </Loading>
    </div>
  )
}

export default ProfilePage