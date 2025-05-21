import { useState } from 'react'

import './App.css'

import Builder from './workflow/Builder'
import { Toaster } from 'sonner'
import { ReactFlowProvider } from 'reactflow'
import WorkflowBuilder from './workflow/WorkflowBuilder'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{height:'100vh',width:'100vw'}} className='w-full h-screen '>
      <ReactFlowProvider>

      <WorkflowBuilder/>
      </ReactFlowProvider>


    {/* <Builder/> */}
    <Toaster/>
  
    <div>Hello</div>
    </div>
  )
}

export default App
