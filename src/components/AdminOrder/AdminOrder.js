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
import * as OrderService from '../../services/OrderService'
import Highlighter from 'react-highlight-words'
import { useSelector } from 'react-redux'
import { useQuery } from 'react-query'
import Loading from '../../LoadingComponent/Loading'
import PieCharts from './PieCharts'
const AdminOrder = () => {
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



    const getAllOrders = async () => {

        const res = await OrderService.getAllOrderAdmin(user?.access_token)
        console.log('getAllOrdersgetAllOrders', res);
        return res
    }
    const queryUser = useQuery({ queryKey: ['orders'], queryFn: getAllOrders, enabled: true })
    const { data: orders, isLoading: isLoadingOrders } = queryUser
    console.log('products', orders);

    useEffect(() => {
        form.setFieldsValue(stateUsersDetails)
        // console.log('form', stateUsersDetails);
    }, [form])



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
            title: 'user Name',
            key: 'userName',
            dataIndex: 'userName',
            render: (text, record) => `<a>${record.userName}</a>`,
            sorter: (a, b) => a.userName.length - b.userName.length,
            // defaultSortOrder: 'descend',
            ...getColumnSearchProps('username'),
            // width:'20%'
        },
        {
            title: 'Phone',
            key: 'phone',
            dataIndex: 'phone',
            render: (text) => <a>String({text})</a>,
            // sorter: (a, b) => a.email - b.email,
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

    const dataTable = orders?.data?.length && orders?.data?.map(orders => {
        console.log('dataSource orders', orders);
        return {
            ...orders,
            key: orders._id,
            paymentMethod: orders.paymentMethod,
            userName: orders?.shippingAddress?.fullName,
            phone: orders?.shippingAddress?.phone,
            address: orders?.shippingAddress?.address

        }
    });






    console.log('stateUsersDetails.image', stateUsersDetails.image);
    // function delete 

    return (
        <div style={{ padding: '10px' }}>
            <WrapperHeader>Quản lí Đơn hàng</WrapperHeader>
            <div style={{ width: '500px', height: '200px' }}>
                <PieCharts data={orders?.data} />
            </div>

            <Button type="primary" onClick={() => setIsModalOpen(true)}>Add</Button>
            <div style={{ marginTop: '15px' }}>
                <TableComponent scroll={{ x: '1500px' }} columns={columns} data={dataTable} products={orders} isLoadingProducts={isLoadingOrders}
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




        </div>
    )
}

export default AdminOrder