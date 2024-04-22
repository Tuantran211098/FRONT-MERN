import { Steps } from 'antd'
import React from 'react'
import { CustomStep } from './index';
const StepProcess = ({current = 0, items = []}) =>  {
    console.log('current',current);
  return (
    <div>
        <Steps
            current={current}
            items={items}
            status='process'
            type='navigation'
       />
             {/* {items.map((item) => {
                return (
                        <CustomStep key={item.title} title={item.title} description={item.description} />
                )
                })} */}
        {/* </Steps> */}
  </div>
  )
}

export default StepProcess