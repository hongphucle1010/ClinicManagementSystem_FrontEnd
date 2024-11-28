import React, { useState } from 'react'
import { Card, Table, Badge, Button, TextInput } from 'flowbite-react'
import { useEffect } from 'react'
import axios from 'axios'

type Peer = {
  id: string
  ip: string
  port: number
  isonline: boolean
  download: string
  upload: string
  hashpiece: string
  peerid: string
  hash: string
  torrentid: string
  size: string
  index: number
  filename: string
  piecesize: string
}

const PeerInfoPage = () => {
  const [peerData, setPeerData] = useState<Peer[]>([])

  // State for the search query
  const [searchQuery, setSearchQuery] = useState('')

  const handleClick = async () => {
    console.log('Search query: ', searchQuery)
    await axios
      .get('https://api-tickportal.ticklab.site/api/peer/get/' + searchQuery)
      .then((response) => {
        setPeerData(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data: ', error)
      })

    console.log(peerData)
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-semibold mb-4'>Peer Information</h1>

      {/* Search Input */}
      <div className='mb-4 flex gap-4'>
        <TextInput
          type='text'
          placeholder='Search by peer id...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full'
        />

        <Button onClick={handleClick} >
          Search
        </Button>
      </div>

      <Card className='shadow-lg'>
        <Table>
          <Table.Head>
            <Table.HeadCell>Filename</Table.HeadCell>
            <Table.HeadCell>Piece Index</Table.HeadCell>
            <Table.HeadCell>Size</Table.HeadCell>
            <Table.HeadCell>Hash</Table.HeadCell>
            <Table.HeadCell>Online Status</Table.HeadCell>
            <Table.HeadCell>Download</Table.HeadCell>
            <Table.HeadCell>Upload</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {peerData.length == 0 ? (
              <>
                <Table.Row>
                  <Table.Cell colSpan={8} className='text-center'>
                    No data found
                  </Table.Cell>
                </Table.Row>
              </>
            ) : (
              peerData.map((item, index) => (
                <Table.Row key={index} className='bg-white dark:bg-gray-800'>
                  <Table.Cell>{item.filename}</Table.Cell>
                  <Table.Cell>{item.index}</Table.Cell>
                  <Table.Cell>{item.size}</Table.Cell>
                  <Table.Cell>{item.hash}</Table.Cell>
                  <Table.Cell>
                    <Badge color={item.isonline ? 'success' : 'failure'}>{item.isonline ? 'Online' : 'Offline'}</Badge>
                  </Table.Cell>
                  <Table.Cell>{item.download}</Table.Cell>
                  <Table.Cell>{item.upload}</Table.Cell>
                  <Table.Cell>
                    <Button color='primary' size='sm'>
                      Download
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Card>
    </div>
  )
}

export default PeerInfoPage
