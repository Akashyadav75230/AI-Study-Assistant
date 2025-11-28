import { Link } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../api'

export default function Forgot(){
  const [email,setEmail]=useState('')
  const [token,setToken]=useState('')
  const [msg,setMsg]=useState('')

  async function onSubmit(e){
    e.preventDefault()
    const { data } = await api().post('/auth/forgot', { email })
    setMsg(data.message)
    if(data.token) setToken(data.token) // demo
  }

  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
      <p className="text-sm mb-4">Enter your email. A reset token (for demo) will be generated.</p>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <button className="btn w-full">Send</button>
      </form>
      {msg && <div className="mt-3">{msg}</div>}
      {token && <div className="mt-2 text-xs break-all">Token: {token}</div>}
      <div className="mt-3 text-sm"><Link to="/reset">Reset password</Link></div>
    </div>
  )
}