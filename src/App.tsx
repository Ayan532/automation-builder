import { useState } from 'react'

import './App.css'
import WorkflowBuilder from './workflow'
import Builder from './workflow/Builder'
import { Toaster } from 'sonner'
import { ReactFlowProvider } from 'reactflow'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{height:'100vh',width:'100vw'}} className='w-full h-screen '>
    {/* <WorkflowBuilder/> */}


    <Builder/>
    <Toaster/>
  
    <div>Hello</div>
    </div>
  )
}

export default App
