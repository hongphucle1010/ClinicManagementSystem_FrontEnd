import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Flowbite } from 'flowbite-react'
import configurePersistedStore from './lib/redux/store/index.ts'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

const { store, persistor } = configurePersistedStore()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Flowbite>
          <App />
        </Flowbite>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
