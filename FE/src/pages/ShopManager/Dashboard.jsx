import React, { useEffect, useState } from 'react'
import ShopCard from '../../components/ShopCard'
import { apiGet } from '../../api/api'
import endpoints from '../../api/endpoints'
import ShopDetail from '../Buyer/ShopDetail'

function Dashboard() {

  const handleChange = (value) =>{
    console.log(value)
  }

  return (
    <div>
      {/* <h1>Dashboard</h1> */}
      {<ShopDetail />}
    </div>
  )
}

export default Dashboard
