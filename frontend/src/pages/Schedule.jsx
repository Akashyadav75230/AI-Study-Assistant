import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Schedule(){
  const [tasks,setTasks]=useState([])
  const [title,setTitle]=useState('')
  const [dueDate,setDueDate]=useState('')

  async function load(){
    const { data } = await api().get('/schedule')
    setTasks(data)
  }
  useEffect(()=>{ load() },[])

  async function add(e){
    e.preventDefault()
    const { data } = await api().post('/schedule', { title, dueDate })
    setTasks([ ...tasks, data ])
    setTitle(''); setDueDate('')
  }

  async function toggle(t){
    const { data } = await api().patch('/schedule/'+t._id, { done: !t.done })
    setTasks(tasks.map(x=>x._id===t._id?data:x))
  }

  async function remove(t){
    await api().delete('/schedule/'+t._id)
    setTasks(tasks.filter(x=>x._id!==t._id))
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h1 className="text-xl font-bold mb-2">Schedule Planner</h1>
        <form className="grid md:grid-cols-3 gap-2" onSubmit={add}>
          <input placeholder="Task title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input type="datetime-local" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
          <button className="btn">Add</button>
        </form>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Your Tasks</h2>
        <div className="space-y-2">
          {tasks.map(t=>(
            <div key={t._id} className="flex items-center justify-between border p-2 rounded-xl">
              <div>
                <div className={"font-medium " + (t.done?'line-through text-gray-400':'')}>{t.title}</div>
                <div className="text-xs text-gray-500">{t.dueDate && new Date(t.dueDate).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={()=>toggle(t)}>{t.done?'Undo':'Done'}</button>
                <button className="btn" onClick={()=>remove(t)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}