import React, { useState } from 'react'
import { TextInput, Button } from 'flowbite-react'

const RegisterFile = () => {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (file) {
      setMessage('File registered successfully!')
    } else {
      setMessage('Please select a file.')
    }
  }

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Register File</h2>
      <TextInput
        type='file'
        // onChange={(e) => setFile(e.target.files[0])}
        className='mb-4'
      />
      <Button onClick={handleSubmit}>Submit</Button>
      {message && <p className='mt-4 text-green-500'>{message}</p>}
    </div>
  )
}

export default RegisterFile
