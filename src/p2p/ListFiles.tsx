import React from 'react'
import { Table } from 'flowbite-react'
import { useState, useEffect } from 'react'
import axios from 'axios'

type File = {
  id: string
  filename: string
  size: string
  piecesize: string
}
const FileInfo = () => {
  const [fileData, setFileData] = useState<File[]>([])
  const calculatePieces = (size: any, pieceSize: any) => Math.ceil(size / pieceSize)

  const formatSize = (size: any) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    let i = 0
    while (size >= 1024 && i < sizes.length - 1) {
      size /= 1024
      i++
    }
    return `${size.toFixed(2)} ${sizes[i]}`
  }

  useEffect(() => {
    axios
      .get('https://api-tickportal.ticklab.site/api/torrentfile')
      .then((response) => {
        setFileData(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data: ', error)
      })
  }, [])

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>File Information</h2>
      <Table>
        <Table.Head>
          <Table.HeadCell>File ID</Table.HeadCell>
          <Table.HeadCell>Filename</Table.HeadCell>
          <Table.HeadCell>Size</Table.HeadCell>
          <Table.HeadCell>Piece Size</Table.HeadCell>
          <Table.HeadCell>Number of Pieces</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {fileData.map((file) => (
            <Table.Row key={file.id}>
              <Table.Cell>{file.id}</Table.Cell>
              <Table.Cell>{file.filename}</Table.Cell>
              <Table.Cell>{formatSize(Number(file.size))}</Table.Cell>
              <Table.Cell>{formatSize(Math.min(Number(file.piecesize), Number(file.size)))}</Table.Cell>
              <Table.Cell>{calculatePieces(Number(file.size), Number(file.piecesize))}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default FileInfo
