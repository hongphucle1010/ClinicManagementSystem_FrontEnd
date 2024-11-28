import React from 'react'
import { Table, Badge } from 'flowbite-react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { getRandomValues, randomInt } from 'crypto'

type Peer = {
  id: string
  ip: string
  port: number
  isonline: boolean
  download: string
  upload: string
}

const PeerList = () => {
  const [peerData, setPeerData] = useState<Peer[]>([])

  const formatSize = (size: any) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    let i = 0
    while (size >= 1024 && i < sizes.length - 1) {
      size /= 1024
      i++
    }
    return `${(size + Math.random() * 5).toFixed(2)} ${sizes[i]}`
  }

  useEffect(() => {
    axios
      .get('https://api-tickportal.ticklab.site/api/peer/get')
      .then((response) => {
        setPeerData(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data: ', error)
      })

    console.log(peerData)
  }, [])

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Peer Information</h2>
      <Table>
        <Table.Head>
          <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>IP Address</Table.HeadCell>
          <Table.HeadCell>Port</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Download</Table.HeadCell>
          <Table.HeadCell>Upload</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {peerData.map((peer) => (
            <Table.Row key={peer.id}>
              <Table.Cell>{peer.id}</Table.Cell>
              <Table.Cell>{peer.ip}</Table.Cell>
              <Table.Cell>{peer.port}</Table.Cell>
              <Table.Cell>
                <Badge color={peer.isonline ? 'green' : 'red'}>{peer.isonline ? 'Online' : 'Offline'}</Badge>
              </Table.Cell>
              <Table.Cell>{formatSize(Number(peer.download))}</Table.Cell>
              <Table.Cell>{formatSize(Number(peer.upload))}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default PeerList
