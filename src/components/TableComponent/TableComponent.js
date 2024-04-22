import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Divider, Dropdown, Pagination, Radio, Space, Table } from 'antd';
import React, { useEffect, useMemo } from 'react'
import { useState } from 'react';
import Loading from '../../LoadingComponent/Loading';
import { Excel } from "antd-table-saveas-excel";

const TableComponent = (props) => {
  console.log('props', props);
  const { selectionType = 'checkbox', isLoadingProducts = false, products = [], data: dataSource = [], columns = [], handleDeleteMany } = props;
  console.log('columns columns', columns, dataSource);
  const [array, setArray] = useState([])
  const [rowSelectedKeys, setRowSelectedKeys] = useState([])
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys)
      // console.log(`selectedRowKeys: ${selectedRowKeys}`);
      // console.log('rowSelected',rowSelectedKeys);
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checked
    //   name: record.name,
    // }),
  };



  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== 'action' && col.dataIndex !== 'avatar')
    return arr
  }, [columns])

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys)
  }
  const handleClickExport = () => {
    console.log('newColumnsExport', array);
    // const excel = new Excel();
    // excel
    //   .addSheet("test")
    //   .addColumns(array)
    //   .addDataSource(dataSource, {
    //     str2Percent: true
    //   })
    //   .saveAs("Excel.xlsx");
  };

  const exportExcel = () => {

    const excel = new Excel();
    console.log('newColumnExport', newColumnExport, excel);
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true
      })
      .saveAs("Excel.xlsx");
  };
  return (
    <div>
      <Loading isLoading={isLoadingProducts}>
        {rowSelectedKeys.length > 0 && (
          <div style={{ background: 'red', color: 'white', width: '100px', padding: '10px' }} onClick={handleDeleteAll}>
            Xóa tất cả
          </div>
        )}
        <button onClick={exportExcel}>Export Excel</button>
        <Table

          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          // rowKey={record => record._id}
          columns={columns}
          dataSource={dataSource}
          {...props}
        />

      </Loading>
    </div>
  )
}

export default TableComponent