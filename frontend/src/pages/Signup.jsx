import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { api } from '../api'

export default function Signup(){
  const [form,setForm]=useState({ name:'', username:'', email:'', password:'' })
  const [msg,setMsg]=useState('')
  const nav = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    setMsg('')
    await api().post('/auth/register', form)
    setMsg('Registered! You can now login.')
    setTimeout(()=>nav('/login'),1000)
  }
  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
        <div><label>Username</label><input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} /></div>
        <div><label>Email</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
        <div><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div>
        <button className="btn w-full">Create account</button>
      </form>
      <div className="mt-3 text-sm"><Link to="/login">Back to login</Link></div>
    </div>
  )
}