import { DeleteOutlined, EditOutlined, PlusCircleFilled, PlusCircleOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, message, Select, Space } from 'antd'
import Modal from 'antd/es/modal/Modal'
import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { WrapperLabel, WrapperUpload } from '../../pages/Profile/style'
import { getBase64, renderOption } from '../../ultils'
import { WrapperHeader } from '../AdminUser/style'
import InputComponent from '../InputComponent/InputComponent'
import TableComponent from '../TableComponent/TableComponent'
import * as ProductService from '../../services/ProductService'
import Loading from '../../LoadingComponent/Loading'
import produce from 'immer'
import { useQuery } from 'react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'
import Highlighter from 'react-highlight-words';

const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [rowSelectedName, setRowSelectedName] = useState('');
    const [size, setSize] = useState();
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [typeSelected, setTypeSelected] = useState('')
    const [typeProduct, setTypeProduct] = useState([])
    const user = useSelector((state) => state?.user)
    // console.log('user', user);
    const [stateProduct, setStateProduct] = useState({
        name: '',
        image: '',
        type: '',
        price: '',
        countIntock: '',
        rating: '',
        discount: 0,
        description: ''
    });
    const [stateProductDetails, setStateProductDetails] = useState({
        name: '',
        image: '',
        type: '',
        price: '',
        countIntock: '',
        rating: '',
        discount: 0,
        description: ''
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
    const mutation = useMutationHooks(
        async (data) => {
            console.log('useMutationHooks', data);
            const {
                name,
                image,
                type,
                price,
                countIntock,
                rating,
                discount,
                description
            } = data

            const response = await ProductService.createProduct({
                name,
                image: image ? image : 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=',
                type,
                price,
                countIntock,
                rating,
                discount,
                description
            })
            console.log('response create', response);
            return response
        }
    )
    const mutationUpdate = useMutationHooks(
        (data) => {
            // console.log('useMutationHooks', data);
            const {
                rowSelected: id, token, ...rests
            } = data

            const response = ProductService.updateProduct(
                id,
                token,
                { ...rests }
            )
            //    console.log('useMutationHooks response',response);
            return response
        }
    )
    const mutationDeleted = useMutationHooks(
        (data) => {
            const {
                id,
                token
            } = data
            console.log('mutationDeleted', id, token);
            const res = ProductService.deleteProduct(id, token)
            // console.log('deleteProduct',res);
            return res
        }
    )
    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const {

                token,
                ...ids
            } = data
            //  console.log('mutationDeleted',id,token);
            const res = ProductService.deleteManyProduct(ids, token)
            // console.log('deleteProduct',res);
            return res
        }
    )
    // console.log('mutationDeletedMany',mutationDeletedMany);
    const onFinish = () => {
        console.log('stateProduct onFinish', stateProduct);
        mutation.mutate(stateProduct, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })

    }
    const onFinishUpdateProduct = () => {
        // console.log('onFinishUpdateProduct',rowSelected,user?.access_token,stateProductDetails);
        mutationUpdate.mutate({ rowSelected, token: user?.access_token, ...stateProductDetails }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })

    }

    const handleDeleteProduct = () => {
        // console.log('handleDeleteProduct',rowSelected);
        mutationDeleted.mutate({
            id: rowSelected, token: user?.access_token
        }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
        // setIsModalOpenDelete(false)
    }

    const handleDeleteMany = (ids) => {
        // console.log('handleDeleteManyProducts',_id);
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }
    const { data, isLoading, isError, isSuccess } = mutation
    const { data: dataUpdate, isLoading: isLoadingUpdated, isError: isErrorUpdated, isSuccess: isSuccessUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isError: isErrorDeleted, isSuccess: isSuccessDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isError: isErrorDeletedMany, isSuccess: isSuccessDeletedMany } = mutationDeletedMany
    console.log('dataDeleted user', dataDeleted);
    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct()
        //  console.log('getAllProduct',res);
        return res
    }
    const getAllTypeProducts = async () => {
        const res = await ProductService.getAllTypeProduct()
        // if(res?.status === 'OK'){
        //   setTypeProduct(res?.data)
        // }
        // console.log('fetchAllTypeProduct',res);
        return res
    }
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts, enabled: true })
    const queryTypeProduct = useQuery({ queryKey: ['type-products'], queryFn: getAllTypeProducts, enabled: true })
    const { data: products, isLoading: isLoadingProducts } = queryProduct
    const { data: typeProducts, isLoading: isLoadingTypeProducts } = queryTypeProduct
    // console.log('typeProducts',typeProducts);
    const fetchGetDetailsProduct = async (id) => {
        const res = await ProductService.getDetailsProduct(id)
        console.log('fetchGetDetailsProduct', res);
        if (res?.data) {
            setStateProductDetails({
                name: res?.data.name,
                image: res?.data.image,
                type: res?.data.type,
                price: res?.data.price,
                countIntock: res?.data.countIntock,
                rating: res?.data.rating,
                discount: res?.data.discount,
                description: res?.data.description
            })
            // setImageDefault(res?.data.image)
        }
        setIsLoadingUpdate(false)
        // return res
    }
    useEffect(() => {
        form.setFieldsValue(stateProductDetails)
        console.log('form', stateProductDetails);
    }, [form, stateProductDetails])
    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsProduct(rowSelected)
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
        {
            title: 'Name',
            key: 'name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            defaultSortOrder: 'descend',
            ...getColumnSearchProps('name'),
            width: '20%'
        },
        {
            title: 'Price',
            key: 'price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '>= 50',
                    value: '>=',
                },
                {
                    text: '< 50',
                    value: '<',
                },

            ],
            //   filterMode: 'tree',
            //   filterSearch: true,
            onFilter: (value, record) => {
                // record.name.startsWith(value)
                console.log('value', value, 'record', record);
                if (value === '>=') {
                    return record.price >= 50
                }
                else if (value === '<') {
                    return record.price < 50
                }
            },
        },
        {
            title: 'Description',
            key: 'description',
            dataIndex: 'description',
        },
        {
            title: 'Rating',
            key: 'rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,

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

        return { ...product, key: product._id }
    });
    console.log('dataSource dataTable', dataTable);
    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            // console.log('success');
            message.success(`${data?.message}`)

            handleCancel()

            form.resetFields();
        } else if (data?.status === 'ERR') {
            // console.log('isError',isError);
            data?.message && message.error(`${data?.message}`)
        }
    }, [isSuccess])
    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            // console.log('success');
            message.success(`${dataDeletedMany?.message}`)

            // handleCancel()

            // form.resetFields();
        } else if (data?.status === 'ERR') {
            // console.log('isError',isError);
            dataDeletedMany?.message && message.error(`${dataDeletedMany?.message}`)
        }
    }, [isSuccessDeletedMany])
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
        // setStateProduct({
        //     name:'',
        //     image:'',
        //     type:'',
        //     price:'',
        //     countIntock:'',
        //     rating:'',
        //     description:''
        //   })
        // form.resetFields();
    };
    const handleCancelDrawer = () => {
        console.log(isModalOpen);
        setIsOpenDrawer(false);
        setStateProductDetails({
            name: '',
            image: '',
            type: '',
            price: '',
            countIntock: '',
            rating: '',
            description: ''
        })
        form.resetFields();
    };
    const handleOnchange = (e) => {
        // console.log('e',e.target.value);
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }
    const handleOnchangeDetails = (e) => {
        // console.log('setStateProductDetails one', stateProductDetails)
        // console.groupCollapsed();
        // console.log('e.target.name', e.target.name)
        // console.log('e.target.value', e.target.value)
        // console.log('setStateProductDetails twence', stateProductDetails)
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })

    }
    const handleOnchangeAvatar = async ({ fileList }) => {

        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
        // setAvatar(file.preview)
        // console.log(stateProduct.image);
    }
    const handleOnchangeAvatarDetails = async ({ fileList }) => {

        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
        // setAvatar(file.preview)
        // console.log(stateProduct.image);
    }


    // function delete 
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const handleCancelDelete = () => {
        setIsLoadingDelete(true)
        setTimeout(() => {
            setIsLoadingDelete(false)
            setIsModalOpenDelete(false)
        }, 2000);
    }
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const handleChangeSelect = (value) => {
        // console.log('value value',value,typeof value,typeSelected,typeof typeSelected);
        setTypeSelected(value)
        console.log('stateProduct truoc', stateProduct);
        setStateProduct({
            ...stateProduct,
            type: value
        })
        console.log('stateProduct sau', stateProduct);
        console.log('setTypeSelect value', value, 'setTypeSelect typeSelect', typeSelected, stateProduct);

        // if(value){

        // }
        console.log('handleChangeSelect', stateProduct, value, typeSelected);

    }
    //   useEffect(()=>{
    //     fetchAllTypeProduct()
    //   },[stateProduct])
    return (
        <div style={{ padding: '10px' }}>
            <WrapperHeader>Quản lí Sản Phẩm</WrapperHeader>
            <Button type="primary" onClick={() => setIsModalOpen(true)}><PlusCircleFilled />Add</Button>
            <div style={{ marginTop: '15px' }}>
                <TableComponent handleDeleteMany={handleDeleteMany} columns={columns} data={dataTable} products={products} isLoadingProducts={isLoadingProducts}
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
            {/* Tạo sản phẩm */}
            <ModalComponent title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} okText='' footer={null}  >
                {/* <Loading isLoading={!isLoading}> */}
                <Form
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    form={form}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                // getContainer={false}
                >
                    <Form.Item
                        label="Name"
                        name="Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Name!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name" />
                    </Form.Item>

                    {/* <Form.Item
                label="Image"
                name="Image"
                rules={[
                {
                    required: true,
                    message: 'Please input your Image!',
                },
                ]}
            >
                <InputComponent />
            </Form.Item> */}


                    <Form.Item
                        label="Type"
                        name="Type"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Type!',
                            },
                        ]}
                    >
                        {/* <InputComponent value={stateProduct.type} onChange={handleOnchange} name="type" /> */}
                        <Select
                            // defaultValue="lucy"
                            name="type"
                            // style={{
                            //     width: 120,
                            // }}
                            value={stateProduct.type}
                            onChange={handleChangeSelect}
                            options={renderOption(typeProducts?.data)}
                        />
                        {
                            typeSelected === 'add_type' && (
                                <InputComponent value={stateProduct.type} onChange={handleOnchange} name="type" />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="Price"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Price!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
                    </Form.Item>
                    <Form.Item
                        label="Count Intock"
                        name="CountIntock"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your CountIntock!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProduct.countIntock} onChange={handleOnchange} name="countIntock" />
                    </Form.Item>
                    <Form.Item
                        label="Rating"
                        name="Rating"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Rating!',
                            },
                        ]}
                    >
                        <InputComponent type="number" value={stateProduct.rating} onChange={handleOnchange} name="rating" />
                    </Form.Item>
                    <Form.Item
                        label="Discount"
                        name="discount"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your discount!',
                            },
                        ]}
                    >
                        <InputComponent type="number" value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="Description"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Description!',
                            },
                        ]}
                    >
                        <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description" />
                    </Form.Item>


                    <Form.Item
                        label="image"
                        name="image"
                        htmlFor='image'
                        rules={[
                            {
                                // required: true,
                                message: 'Please input your image!',
                            },
                        ]}
                    >
                        {/* <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description"/> */}
                        {stateProduct.image && (
                            <img src={stateProduct?.image} style={{
                                height: '100px',
                                width: '100px',
                                objectFit: 'contain'
                            }} />
                        )}
                        <WrapperUpload name="image" onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button>Select File</Button>
                        </WrapperUpload>
                    </Form.Item>

                    {/* <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                offset: 8,
                span: 16,
                }}
            >
                <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

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
                {/* </Loading> */}
            </ModalComponent>


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
                        onFinish={onFinishUpdateProduct}
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
                            <InputComponent value={stateProductDetails.name} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>


                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Type!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetails.type} onChange={handleOnchangeDetails} name="type" />
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Price!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
                        </Form.Item>
                        <Form.Item
                            label="CountIntock"
                            name="countIntock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your CountIntock!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetails.countIntock} onChange={handleOnchangeDetails} name="countIntock" />
                        </Form.Item>
                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Rating!',
                                },
                            ]}
                        >
                            <InputComponent type="number" value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating" />
                        </Form.Item>
                        <Form.Item
                            label="Discount"
                            name="discount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Discount!',
                                },
                            ]}
                        >
                            <InputComponent type="number" value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount" />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Description!',
                                },
                            ]}
                        >
                            <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description" />
                        </Form.Item>


                        <Form.Item
                            label="Image"
                            name="image"
                            // htmlFor='image'
                            rules={[
                                {
                                    // required: true,
                                    message: 'Please input your image!',
                                },
                            ]}
                        >
                            {/* <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description"/> */}

                            <WrapperUpload onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                <Button>Select File</Button>
                                {stateProductDetails.image && (
                                    <img alt="avatar" src={stateProductDetails?.image} style={{
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

                        {/* <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                offset: 8,
                span: 16,
                }}
            >
                <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

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
            <ModalComponent forceRender title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                <Loading isLoading={isLoadingDelete || isLoadingDeleted}>
                    <div>
                        Bạn có muốn xóa sản phẩm <strong style={{ color: 'red' }}>{rowSelectedName && rowSelectedName}</strong> này không?
                    </div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminProduct
