import { Modal } from 'antd'
import React from 'react'

const ModalComponent = ({title="Confirm",isOpen,children,...rests}) => {
  return (
    <div>
        <Modal title={title} open={isOpen} {...rests}>
        {children}
      </Modal>
    </div>
  )
}

export default ModalComponent