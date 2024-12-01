import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ParentPage from '../pages/Parent.page'
import ChildrenPage from '../pages/ChildrenManagement/Children.page'
import MedicalExaminationPage from '../pages/MedicalExamination.page'
import MedicalExaminationDetailPage from '../pages/MedicalExaminationDetail.page'
import LandingPage from '../pages/LandingPage'
import MainLayout from '../layout/MainLayout/MainLayout'
import LogIn from '../pages/RegisterExamination/LogIn'
import RegisterExamination from '../pages/RegisterExamination/RegisterExamination'
import DrugManagement from '../pages/Drug.page'
import Services from '../pages/ServiceExamination.page.tsx'

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
      path: '/login',
      element: (
        <MainLayout>
          <LogIn />
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
    },
    {
      path: '/registerexamination',
      element: (
        <MainLayout>
          <RegisterExamination />
        </MainLayout>
      )
    },
    {
      path: '/drug',
      element: (
        <MainLayout>
          <DrugManagement />
        </MainLayout>
      )
    },
    {
      path: '/services',
      element: (
        <MainLayout>
          <Services />
        </MainLayout>
      )
    }
  ]
  const router = createBrowserRouter(userRoutes)
  return <RouterProvider router={router} />
}

export default Router
