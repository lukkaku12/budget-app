import React from 'react'
import './PublicLayout.css'
import BudgetsView from '../pages/BudgetsView'

const PublicLayout = () => {
  return (
    <div className='layout'>
    <div className="header">
        <h1>Public Layout</h1>
  
    </div>

    <BudgetsView/>

{/* aqui ira el enrutador privado del usuario, cuando se loggee */ }
    <div className="header">
        <h1>Public Layout</h1>
  
    </div>
    </div>
  )
}

export default PublicLayout