import { Link } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../api'

export default function Reset(){
  const [token,setToken]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [msg,setMsg]=useState('')
  async function onSubmit(e){
    e.preventDefault()
    const { data } = await api().post('/auth/reset', { token, newPassword })
    setMsg(data.message || 'Updated')
  }
  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div><label>Token</label><input value={token} onChange={e=>setToken(e.target.value)} /></div>
        <div><label>New Password</label><input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} /></div>
        <button className="btn w-full">Update</button>
      </form>
      {msg && <div className="mt-3">{msg}</div>}
      <div className="mt-3 text-sm"><Link to="/login">Back to login</Link></div>
    </div>
  )
}