import { Label, TextInput, Button } from 'flowbite-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux' // Import useDispatch
import { logInReducer } from '../../lib/redux/reducers/userState' // Import the action
import { useNavigate } from 'react-router-dom' // Import useNavigate

const LogIn: React.FC = () => {
  const [cccdFormatted, setCccdFormatted] = useState('')
  const dispatch = useDispatch() // Initialize useDispatch
  const navigate = useNavigate() // Initialize useNavigate

  return (
    <div className='w-full h-full flex flex-col gap-2 justify-center items-center'>
      <div className='block'>
        <Label htmlFor='base' value='Nhập căn cước công dân' />
      </div>
      <TextInput
        id='base'
        type='text'
        inputMode='numeric'
        sizing='md'
        value={cccdFormatted}
        maxLength={14}
        onChange={(e) => {
          const input = e.target.value.replace(/\D/g, '').slice(0, 12)
          const formattedInput = input.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
          setCccdFormatted(formattedInput)
        }}
      />
      <Button
        type='submit'
        onClick={() => {
          dispatch(logInReducer({ cccd: cccdFormatted.replace(/\s/g, '') })) // Dispatch the action with formatted cccd
          navigate('/registerexamination') // Navigate to RegisterExamination page
        }}
      >
        OK
      </Button>
    </div>
  )
}

export default LogIn
