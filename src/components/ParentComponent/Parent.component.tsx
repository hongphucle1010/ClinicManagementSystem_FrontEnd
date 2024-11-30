import React, { useState } from 'react'
import { Button, TextInput } from 'flowbite-react'

type Parent = {
  cccd: string
  hoten: string
  sdt: string
  sonha: string
  tenduong: string
  phuong: string
  huyen: string
  tinh: string
}

// Parent Form Component
interface ParentFormProps {
  onSubmit: (ParentData: Parent) => void
}

const ParentForm: React.FC<ParentFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<Parent>({
    cccd: '',
    hoten: '',
    sdt: '',
    sonha: '',
    tenduong: '',
    phuong: '',
    huyen: '',
    tinh: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = () => {
    if (form.cccd && form.hoten && form.sdt) {
      onSubmit(form)
    } else {
      alert('Please fill in all required fields.')
    }
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Input Fields */}
        <TextInput
          id='cccd'
          name='cccd'
          type='text'
          placeholder='Citizen ID (CCCD)'
          value={form.cccd}
          onChange={handleChange}
          required
        />
        <TextInput
          id='hoten'
          name='hoten'
          type='text'
          placeholder='Full Name'
          value={form.hoten}
          onChange={handleChange}
          required
        />
        <TextInput
          id='sdt'
          name='sdt'
          type='text'
          placeholder='Phone Number'
          value={form.sdt}
          onChange={handleChange}
          required
        />
        <TextInput
          id='sonha'
          name='sonha'
          type='text'
          placeholder='House Number'
          value={form.sonha}
          onChange={handleChange}
        />
        <TextInput
          id='tenduong'
          name='tenduong'
          type='text'
          placeholder='Street Name'
          value={form.tenduong}
          onChange={handleChange}
        />
        <TextInput
          id='phuong'
          name='phuong'
          type='text'
          placeholder='Ward'
          value={form.phuong}
          onChange={handleChange}
        />
        <TextInput
          id='huyen'
          name='huyen'
          type='text'
          placeholder='District'
          value={form.huyen}
          onChange={handleChange}
        />
        <TextInput id='tinh' name='tinh' type='text' placeholder='Province' value={form.tinh} onChange={handleChange} />
      </div>
      <div className='mt-4'>
        <Button onClick={handleSubmit}>Save Parent</Button>
      </div>
    </div>
  )
}

export default ParentForm
