import React from 'react';
import { Alert, Spin, Switch } from 'antd';
const Loading = ({children,isLoading,delay =200}) => {

    return(
        <Spin spinning={isLoading} delay={500}>
            {children}
            </Spin>
    )
}
export default Loading