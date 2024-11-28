import React, { useState } from 'react'
import { Sidebar, Button, Modal, Tabs } from 'flowbite-react'
import HelpSection from './HelpSection'
import RegisterFile from './RegisterFile'
import DownloadFile from './DownloadFile'
import ListFiles from './ListFiles'
import PeerInfo from './PeerInfo'
import PeerList from './PeerList'

function App() {
  const [activeTab, setActiveTab] = useState('Help')
  const [isExitModalOpen, setIsExitModalOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case 'Help':
        return <HelpSection />
      case 'List Files':
        return <ListFiles />
      case 'Peer Information':
        return <PeerInfo />
      case 'Peer List':
        return <PeerList />
      default:
        return <div>Select a feature from the navigation panel.</div>
    }
  }

  return (
    <div className='flex h-screen'>
      {/* Navigation Sidebar */}
      <Sidebar aria-label='Sidebar'>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            {['Help', 'List Files', 'Peer Information', 'Peer List'].map((tab) => (
              <Sidebar.Item
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? 'bg-blue-500 text-white' : ''}
              >
                {tab}
              </Sidebar.Item>
            ))}
            <Sidebar.Item onClick={() => setIsExitModalOpen(true)}>Exit</Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      {/* Content Area */}
      <main className='flex-1 p-4 overflow-y-auto bg-gray-100'>{renderContent()}</main>

      {/* Exit Confirmation Modal */}
      <Modal show={isExitModalOpen} onClose={() => setIsExitModalOpen(false)}>
        <Modal.Header>Confirm Exit</Modal.Header>
        <Modal.Body>Are you sure you want to exit?</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => alert('Exiting...')}>Yes</Button>
          <Button color='gray' onClick={() => setIsExitModalOpen(false)}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default App
