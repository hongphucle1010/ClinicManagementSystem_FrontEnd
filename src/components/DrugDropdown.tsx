import React, { useState } from 'react'
import { Dropdown } from 'flowbite-react'

type DrugDropdownProps = {
  // Props definition
  maso: string
  ten: string
}

const DrugDropdown = (selectedDrug: any, setSelectedDrug: any) => {
  // List of drugs
  const drugs = [
    { maso: '108cbaf3-4a55-4af9-aff8-05c0e53e88d3', ten: 'Paracetamol' },
    { maso: '1d68f613-39f6-4c6d-ae2e-2049413723bd', ten: 'Amoxicillin' },
    { maso: '556b7f78-8aae-4950-b514-dc5ef6043379', ten: 'Vitamin C' },
    { maso: '23c4b4f9-7808-425a-b9ad-bd87123c9e70', ten: 'Siro ho trẻ em' },
    { maso: '4e7f553d-64df-49f1-97e1-1bdf48605900', ten: 'Thuốc nhỏ mắt' },
    { maso: '6931126e-5585-4831-9f46-27404fab3835', ten: 'Dung dịch muối sinh lý' },
    { maso: '1785b041-0e91-4f8a-b9af-389a16a256f9', ten: 'Thuốc kháng sinh' },
    { maso: 'b63e91bd-90c4-4540-90e5-4e39c8dc6867', ten: 'Thuốc tiêu hóa' },
    { maso: 'b6280a49-b287-49b1-94c0-51ae763e2488', ten: 'Dung dịch hạ sốt' },
    { maso: 'b3d14aea-7066-4553-b99f-54e4fcae7974', ten: 'Thuốc bổ tổng hợp' },
    { maso: 'e9b69318-4400-42b8-a305-78e29d126ccd', ten: 'Cefurich 500mg' },
    { maso: '5dcd1ad9-da5e-4d59-abae-1d956354bc32', ten: 'Acetuss 200mg/10ml' },
    { maso: '1199a177-efc2-437f-8b03-7980e3802ea0', ten: 'Dorithricin' }
  ]

  const handleDrugSelection = (drug: DrugDropdownProps) => {
    setSelectedDrug(drug)
  }

  return (
    <div>
      <Dropdown label={selectedDrug ? selectedDrug.ten : 'Chọn thuốc'}>
        {drugs.map((drug) => (
          <Dropdown.Item key={drug.maso} onClick={() => handleDrugSelection(drug)}>
            {drug.ten}
          </Dropdown.Item>
        ))}
      </Dropdown>

      {/* Display selected drug details */}
      {selectedDrug && (
        <div>
          <p>Mã thuốc: {selectedDrug.maso}</p>
          <p>Tên thuốc: {selectedDrug.ten}</p>
        </div>
      )}
    </div>
  )
}

export default DrugDropdown
