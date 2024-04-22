import { AppstoreOutlined, CarTwoTone, MailOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd'
import React from 'react'
import { useState } from 'react';
import AdminOrder from '../../components/AdminOrder/AdminOrder';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminUser from '../../components/AdminUser/AdminUser';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import { getItem } from '../../ultils';

const AdminPage = () => {
    const items = [
        getItem('Người dùng', 'user', <UserOutlined />),
        getItem('Sản phẩm', 'product', <AppstoreOutlined />),
        getItem('Đơn hàng', 'order', <CarTwoTone />)
    ];
    const [keySelected, setKeySelected] = useState('');
    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return (
                    <AdminUser />
                )
            case 'product':
                return (
                    <AdminProduct />
                )
            case 'order':
                return (
                    <AdminOrder />
                )

            default:
                return <AdminUser />
        }
    }
    const handleOnclick = ({ key }) => {
        // console.log(key);
        setKeySelected(key)
    }
    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />
            <div style={{ display: 'flex' }}>
                <Menu
                    mode="inline"
                    // openKeys={openKeys}
                    // onOpenChange={onOpenChange}
                    style={{
                        width: 256,
                        height: '100vh',
                        boxShadow: '1px 1px 2px #ccc'
                    }}
                    onClick={handleOnclick}
                    items={items}
                />
                <div style={{ flex: 1 }}>
                    {/* {keySelected === '6' && <span>key la 6</span>} */}
                    {renderPage(keySelected)}
                </div>
            </div>
        </>
    )
}

export default AdminPage