import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ParentPage from '../pages/Parent.page'
import ChildrenPage from '../pages/Children.page'
import MedicalExaminationPage from '../pages/MedicalExamination.page'
import MedicalExaminationDetailPage from '../pages/MedicalExaminationDetail.page'
import LandingPage from '../pages/LandingPage'
import MainLayout from '../layout/MainLayout/MainLayout'

const Router: React.FC = () => {
  const userRoutes = [
    {
      path: '/',
      element: (
        <MainLayout>
          <LandingPage />
        </MainLayout>
      ),
      errorElement: (
        <div>
          <h1>Home Error</h1>
        </div>
      )
    },
    {
      path: '/parent',
      element: (
        <MainLayout>
          <ParentPage />
        </MainLayout>
      )
    },
    {
      path: '/children',
      element: (
        <MainLayout>
          <ChildrenPage />
        </MainLayout>
      )
    },
    {
      path: '/medicalexamination',
      element: (
        <MainLayout>
          <MedicalExaminationPage />
        </MainLayout>
      )
    },
    {
      path: '/medicalexamination/detail',
      element: (
        <MainLayout>
          <MedicalExaminationDetailPage />
        </MainLayout>
      )
    }
  ]
  const router = createBrowserRouter(userRoutes)
  return <RouterProvider router={router} />
}

export default Router
