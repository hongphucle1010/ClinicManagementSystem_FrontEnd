import { useSelector } from 'react-redux' // Import useSelector
import { RootState } from '../../lib/redux/store'

const RegisterExamination: React.FC = () => {
  const cccd = useSelector((state: RootState) => state.user.value.cccd) // Retrieve cccd from the Redux store

  return (
    <div>
      <h1>RegisterExamination</h1>
      <p>CCCD: {cccd}</p>
    </div>
  )
}

export default RegisterExamination
