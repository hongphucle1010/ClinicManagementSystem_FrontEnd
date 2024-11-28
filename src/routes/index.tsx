import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ParentPage from '../page/Parent.page'
import ChildrenPage from '../page/Children.page'
import MedicalExaminationPage from '../page/MedicalExamination.page'
import MedicalExaminationDetailPage from '../page/MedicalExaminationDetail.page'
import App from '../p2p/ui'

const Router: React.FC = () => {
  const userRoutes = [
    {
      path: '/',
      element: <App />,
      errorElement: (
        <div>
          <h1>Home Error</h1>
        </div>
      )
    },
    {
      path: '/parent',
      element: <ParentPage />
    },
    {
      path: '/children',
      element: <ChildrenPage />
    },
    {
      path: '/medicalexamination',
      element: <MedicalExaminationPage />
    },
    {
      path: '/medicalexamination/detail',
      element: <MedicalExaminationDetailPage />
    }
  ]
  const router = createBrowserRouter(userRoutes)
  return <RouterProvider router={router} />
}

export default Router
