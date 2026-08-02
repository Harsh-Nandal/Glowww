'use client'

import { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { store } from '@/store'
import { fetchProfile } from '@/store/slices/authSlice'

// The session lives in an httpOnly cookie (lw_token), which the browser
// keeps across reloads — but Redux's in-memory auth state doesn't. Without
// this, every reload starts from isAuthenticated: false until the user logs
// in again, even though the cookie is still valid server-side.
function AuthBootstrap() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  return null
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}
    </Provider>
  )
}
