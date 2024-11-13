import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const Router: React.FC = () => {
  const userRoutes = [
    {
      path: '/',
      element: (
        <div>
          <h1>Home</h1>
        </div>
      ),
      errorElement: (
        <div>
          <h1>Home Error</h1>
        </div>
      )
    }
  ]
  const router = createBrowserRouter(userRoutes)
  return <RouterProvider router={router} />
}

export default Router
