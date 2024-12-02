import { useEffect, useState } from 'react'
import { TextInput, Dropdown } from 'flowbite-react'
import axios from 'axios'

interface DrugSelectorProps {
  newDrug: Partial<SoluongDrug>
  setNewDrug: React.Dispatch<React.SetStateAction<Partial<SoluongDrug>>>
}

const DrugSelector = ({ newDrug, setNewDrug }: DrugSelectorProps) => {
  const [drugData, setDrugData] = useState<Partial<SoluongDrug>[]>([])

  const handleDrugSelect = (selectedDrug: Partial<SoluongDrug>) => {
    setNewDrug({ ...newDrug, maso_th: selectedDrug.maso })
  }

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/thuoc')
      .then((res) => {
        setDrugData(res.data)
      })
      .catch((err) => {
        console.error(err.message)
      })
  }, [])

  return (
    <div className='flex flex-col space-y-4'>
      <Dropdown label='Chọn mã thuốc'>
        {drugData.map((drug) => (
          <Dropdown.Item key={drug.maso} onClick={() => handleDrugSelect(drug)}>
            {drug.ten}
          </Dropdown.Item>
        ))}
      </Dropdown>
      <TextInput placeholder='Mã thuốc' value={newDrug.maso_th} readOnly />
      <TextInput
        placeholder='Số lượng'
        type='number'
        onChange={(e) => setNewDrug({ ...newDrug, soluong: parseInt(e.target.value) })}
      />
      <TextInput placeholder='Cách sử dụng' onChange={(e) => setNewDrug({ ...newDrug, cachsd: e.target.value })} />
    </div>
  )
}

export default DrugSelector
