import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({children, role}) => {

  const user = useSelector(state => state.auth.user) 
  const loading = useSelector(state => state.auth.loading) 

  if(loading){
    return <div>Loading</div>
  }

  // Not logged in → redirect to login
  if(!user){
    return <Navigate to="/login"/>
  }

  // Logged in but wrong role → redirect to home
  if(role && user.role !== role){
    return <Navigate to="/"/>
  }

  return children
}

export default Protected