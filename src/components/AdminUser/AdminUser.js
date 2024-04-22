import React, { useEffect, useRef, useState } from 'react'
import { DeleteOutlined, EditOutlined, PlusCircleFilled, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, message, Space } from 'antd'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { WrapperUpload } from '../../pages/Profile/style'
import { getBase64 } from '../../ultils'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import InputComponent from '../InputComponent/InputComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import TableComponent from '../TableComponent/TableComponent'
import { WrapperHeader } from './style'
import * as UserService from '../../services/UserService'
import * as ProductService from '../../services/ProductService'
import Highlighter from 'react-highlight-words'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-query'
import Loading from '../../LoadingComponent/Loading'
const AdminUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [rowSelectedName, setRowSelectedName] = useState('');
    const [size, setSize] = useState();
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);


    const user = useSelector((state) => state?.user)
    console.log('AdminUser user', user);
    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address: ''
    });
    const [stateUsersDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address: ''
    });
    const [form] = Form.useForm();
    message.config({
        top: 10,
        duration: 1,
        maxCount: 1,
        rtl: true,
        prefixCls: 'my-message',
    });
    const showModal = () => {
        setIsModalOpen(true);
    };
    //   const handleOk = () => {
    //     onFinish()
    //   };

    const mutationUpdate = useMutationHooks(
        (data) => {
            console.log('useMutationHooks', data);
            const {
                rowSelected: id, token, ...rests
            } = data

            const response = UserService.updateUser(
                id,
                { ...rests },
                token

            )
            //    console.log('useMutationHooks response',response);
            return response
        }
    )
    const mutationDeleted = useMutationHooks(
        async (data) => {
            const {
                id,
                token
            } = data
            console.log('mutationDeleted user', id, token);
            const res = await UserService.deleteUser(id, token)
            console.log('deleteProduct', res);
            return res
        }
    )

    const mutationDeletedMany = useMutationHooks(
        async (data) => {
            const {

                token, ...ids
            } = data

            const res = await UserService.deleteManyUser(ids, token)
            console.log('deleteProduct', res);
            return res
        }
    )

    const onUpdateUser = () => {
        console.log('onFinishUpdateUser', stateUsersDetails);
        mutationUpdate.mutate({
            rowSelected,
            ...stateUsersDetails
            ,
            token: user?.access_token,
        }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleDeleteUser = () => {
        // console.log('handleDeleteProduct',rowSelected);
        mutationDeleted.mutate({
            id: rowSelected, token: user?.access_token
        }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
        // setIsModalOpenDelete(false)
    }
    const handleDeleteMany = (ids) => {
        console.log('handleDeleteUserMany', ids);
        mutationDeletedMany.mutate({
            ids: ids, token: user?.access_token
        }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })

    }


    const { data: dataUpdate, isLoading: isLoadingUpdated, isError: isErrorUpdated, isSuccess: isSuccessUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isError: isErrorDeleted, isSuccess: isSuccessDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isError: isErrorDeletedMany, isSuccess: isSuccessDeletedMany } = mutationDeletedMany
    console.log('mutationDeleted', isLoadingDeleted, 'isSuccessDeleted', isSuccessDeleted);
    const getAllUsers = async () => {

        const res = await UserService.getAllUser(user?.access_token)

        return res
    }
    const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUsers, enabled: true })
    const { data: products, isLoading: isLoadingProducts } = queryUser
    console.log('products', products);
    const fetchGetDetailsUser = async (id) => {
        const res = await UserService.getDetailsUser(id)
        if (res?.data) {
            setStateUserDetails({
                name: res?.data.name,
                email: res?.data.email,
                phone: res?.data.phone,
                isAdmin: res?.data.isAdmin,
                avatar: res?.data.avatar,
                address: res?.data.address
            })
            // setImageDefault(res?.data.image)
        }
        setIsLoadingUpdate(false)
        // return res
    }
    useEffect(() => {
        form.setFieldsValue(stateUsersDetails)
        // console.log('form', stateUsersDetails);
    }, [form, stateUsersDetails])
    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsUser(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])
    //   console.log('stateProductDetails',stateProductDetails);
    const handleDetailsProduct = () => {
        console.log('handleDetailsProduct', rowSelected);
        // if(rowSelected){
        //     setIsLoadingUpdate(true)
        //     fetchGetDetailsProduct(rowSelected)
        // }
        setIsOpenDrawer(true)
    }
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ fontSize: '20px', color: 'red' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ fontSize: '20px', color: '#08c', marginLeft: '10px' }} onClick={handleDetailsProduct} />
            </div>
        )
    }
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,

                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={`${selectedKeys[0] || ''}`}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [
        // isAdmin,
        // createdAt,
        // updatedAt,
        {
            title: 'Name',
            key: 'name',
            dataIndex: 'name',
            render: (text, record) => <a href={`/get-details/${record._id}`}>{text}</a>,
            sorter: (a, b) => a.name - b.name,
            // defaultSortOrder: 'descend',
            ...getColumnSearchProps('name'),
            // width:'20%'
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email',
            render: (text) => <a>String({text})</a>,
            // sorter: (a, b) => a.email - b.email,
            // defaultSortOrder: 'descend',
            ...getColumnSearchProps('email'),
            // width:'20%'
        },
        {
            title: 'Phone',
            key: 'phone',
            dataIndex: 'phone',
            render: (text) => <a>String({text})</a>,
            sorter: (a, b) => a.phone - b.phone,
            // defaultSortOrder: 'descend',
            ...getColumnSearchProps('phone'),
            // width:'20%'
        },
        {
            title: 'Address',
            key: 'address',
            dataIndex: 'address',
            render: (text) => <a>String({text})</a>,
            sorter: (a, b) => a.address - b.address,
            // defaultSortOrder: 'descend',
            ...getColumnSearchProps('address'),
            // width:'20%'
        },
        {
            title: 'Password',
            key: 'password',
            dataIndex: 'password',
            sorter: (a, b) => a.password - b.password,

            //   filterMode: 'tree',
            //   filterSearch: true,
            //   onFilter: (value, record) => {
            //     // record.name.startsWith(value)
            //     console.log('value',value,'record',record);
            //     if(value === '>='){
            //         return record.price >= 50
            //     }   
            //     else if(value === '<'){
            //         return record.price < 50
            //     }
            // },
        },
        {
            title: 'Admin',
            key: 'isAdmin',
            dataIndex: 'isAdmin',
            sorter: (a, b) => a.isAdmin - b.isAdmin,
            // render:(val)=><div className="text_overlap">{val ? 'True':'False'}</div>,
            render: (text, record) => `${record.isAdmin}`
        },
        {
            title: 'Avatar',
            key: 'avatar',
            dataIndex: 'avatar',
            // sorter: (a, b) => a.isAdmin - b.isAdmin,
            // render:(val)=><div className="text_overlap">{val ? 'True':'False'}</div>,
            render: (text) => <img src={text ? `${String(text)}` : 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'} style={{
                height: '60px',
                width: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginLeft: '10px'
            }} />,
        },
        {
            title: 'CreatedAt',
            key: 'createdAt',
            dataIndex: 'createdAt',
            sorter: (a, b) => a.createdAt - b.createdAt,

        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            render: renderAction

        },
    ];
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const dataTable = products?.data?.length && products?.data?.map(product => {
        //  console.log('dataSource data',product);
        return { ...product, key: product._id }
    });


    useEffect(() => {
        if (isSuccessUpdated && dataUpdate?.status === 'OK') {
            // console.log('success');
            message.success(`${dataUpdate?.message}`)
            handleCancelDrawer()
            // setTimeout(() => {
            //     // console.log('setTimeout');
            //     // handleCancel()
            //     setIsOpenDrawer(false);
            // }, 2000);

            //    form.resetFields();
        } else if (dataUpdate?.status === 'ERR') {
            // console.log('isError',isError);
            dataUpdate?.message && message.error(`${dataTable?.message}`)
        }
    }, [isSuccessUpdated])
    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            // console.log('success');
            message.success(`${dataDeletedMany?.message}`)
        } else if (dataUpdate?.status === 'ERR') {
            // console.log('isError',isError);
            dataDeletedMany?.message && message.error(`${dataDeletedMany?.message}`)
        }
    }, [isSuccessDeletedMany])
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            // console.log('success');
            message.success(`${dataDeleted?.message}`)

            handleCancelDelete()
            // setTimeout(() => {
            //     // console.log('setTimeout');
            //     // handleCancel()
            //     setIsOpenDrawer(false);
            // }, 2000);

            //    form.resetFields();
        } else if (dataDeleted?.status === 'ERR') {
            // console.log('isError',isError);
            dataDeleted?.message && message.error(`${dataDeleted?.message}`)
        }
    }, [isSuccessDeleted])
    //   console.log('mutation',data,isLoading,isError,isSuccess);    
    const handleCancel = () => {
        console.log(isModalOpen);
        setIsModalOpen(false);
        setStateUser({
            name: '',
            email: '',
            phone: '',
            isAdmin: false
        })
        form.resetFields();
    };
    const handleCancelDrawer = () => {
        // console.log(isModalOpen);
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false
        })
        form.resetFields();
    };
    const handleOnchange = (e) => {
        // console.log('e',e.target.value);
        setStateUser({
            ...stateUser,
            [e.target.name]: e.target.value
        })
    }
    const handleOnchangeDetails = (e) => {
        console.log('handleOnchangeDetails', [e.target.name], e.target.value);
        // console.log('setStateUserDetails one', stateProductDetails)
        // console.groupCollapsed();
        // console.log('e.target.name', e.target.name)
        // console.log('e.target.value', e.target.value)
        // console.log('setStateUserDetails twence', stateProductDetails)
        setStateUserDetails({
            ...stateUsersDetails,
            [e.target.name]: e.target.value
        })
        console.log('handleOnchangeDetails state', [e.target.name], e.target.value, stateUsersDetails)
    }
    const handleOnchangeAvatar = async ({ fileList }) => {

        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUser({
            ...stateUser,
            image: file.preview
        })
        // setAvatar(file.preview)
        // console.log(stateProduct.image);
    }
    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        console.log('handleOnchangeAvatarDetails image', stateUsersDetails.image);
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserDetails({
            ...stateUsersDetails,
            avatar: file.preview
        })
        // setAvatar(file.preview)

    }
    console.log('stateUsersDetails.image', stateUsersDetails.image);
    // function delete 
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const handleCancelDelete = () => {
        setIsLoadingDelete(true)
        setTimeout(() => {
            setIsLoadingDelete(false)
            setIsModalOpenDelete(false)
        }, 2000);
    }
    return (
        <div style={{ padding: '10px' }}>
            <WrapperHeader>Quản lí người dùng</WrapperHeader>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>Add</Button>
            <div style={{ marginTop: '15px' }}>
                <TableComponent scroll={{ x: '1500px' }} handleDeleteMany={handleDeleteMany} columns={columns} data={dataTable} products={products} isLoadingProducts={isLoadingProducts}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                console.log('onClick record', record);
                                setSize('large');
                                setRowSelectedName(record.name)
                                setRowSelected(record._id)
                            }, // click row

                        };
                    }}
                />
            </div>


            {/* Edit sản phẩm */}
            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}
                width='60%'
            >

                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="complex-form"
                        labelCol={{
                            span: 2,
                        }}
                        wrapperCol={{
                            span: 22,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onUpdateUser}
                        form={form}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Name!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUsersDetails.name} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>


                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUsersDetails.email} onChange={handleOnchangeDetails} name="email" />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUsersDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your address!',
                                },
                            ]}
                        >
                            <InputComponent value={stateUsersDetails.address} onChange={handleOnchangeDetails} name="address" />
                        </Form.Item>

                        <Form.Item
                            label="Image"
                            name="image"
                        // htmlFor='image'
                        // rules={[
                        //     {
                        //         // required: true,
                        //         message: 'Please input your image!',
                        //     },
                        // ]}
                        >
                            {/* <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description"/>  */}

                            <WrapperUpload onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                <Button>Select File</Button>
                                {stateUsersDetails.avatar && (
                                    <img alt="avatar" src={stateUsersDetails?.avatar} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} />
                                )
                                }
                            </WrapperUpload>
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>

            {/* Xóa sản phẩm */}
            <ModalComponent forceRender title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
                <Loading isLoading={isLoadingDelete || isLoadingDeleted}>
                    <div>
                        Bạn có muốn xóa người dùng<strong style={{ color: 'red' }}>{rowSelectedName && rowSelectedName}</strong> này không?
                    </div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminUser