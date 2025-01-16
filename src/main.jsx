import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Register from './Pages/Register.jsx'
import Login from './Pages/Login.jsx'
import Home from './Pages/Home.jsx'


const router=createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    children:[
    {
      path:'',
      element:<Home/>
    },
    {
      path:'register',
      element:<Register/>
    },
    {
      path:'login',
      element:<Login/>
    }
  
  
  ]
}
])

createRoot(document.getElementById('root')).render(

  <RouterProvider router={router}>
     <App />
  </RouterProvider>
)
