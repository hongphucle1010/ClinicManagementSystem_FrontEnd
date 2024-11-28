import React, { useState } from 'react'
import { Table, Progress, Button } from 'flowbite-react'

const DownloadFile = () => {
  const [files] = useState([
    { name: 'file1.txt', size: '2MB' },
    { name: 'file2.jpg', size: '4MB' }
  ])
  const [progress, setProgress] = useState(0)

  const handleDownload = (fileName: any) => {
    setProgress(50) // Mock progress
    setTimeout(() => setProgress(100), 2000)
  }

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Download File</h2>
      <Table>
        <Table.Head>
          <Table.HeadCell>File Name</Table.HeadCell>
          <Table.HeadCell>File Size</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {files.map((file) => (
            <Table.Row key={file.name}>
              <Table.Cell>{file.name}</Table.Cell>
              <Table.Cell>{file.size}</Table.Cell>
              <Table.Cell>
                <Button onClick={() => handleDownload(file.name)}>Download</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {/* {progress > 0 && <Progress value={progress} />} */}
    </div>
  )
}

export default DownloadFile
