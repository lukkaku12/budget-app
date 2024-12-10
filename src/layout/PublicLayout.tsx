import React from 'react'
import './PublicLayout.css'
import BudgetsView from '../pages/BudgetsView'

const PublicLayout = () => {
  return (
    <div className='layout'>
    <div className="header">
      <div className='son-1'>
        <h1>Payout Pal</h1>

      </div>
      <div className='son-2'>
        <h1>Profile</h1>

      </div>
  
    </div>

    <BudgetsView/>

{/* aqui ira el enrutador privado del usuario, cuando se loggee */ }
    <div className="header bottom">
        <h3 className='bottomText'>All rights reserved. 2024</h3>
  
    </div>
    </div>
  )
}

export default PublicLayout