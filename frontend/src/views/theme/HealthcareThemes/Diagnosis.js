import React, { useEffect, useState } from 'react'
import {
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
} from '@coreui/react'

const Diagnosis = () => {
  const [diagnosisList, setDiagnosisList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8081/diagnosis-list')
      .then((res) => res.json())
      .then((data) => {
        setDiagnosisList(data.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching diagnosis list:', error)
        setLoading(false)
      })
  }, [])

  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>DiagnosisList</strong>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <CSpinner color="primary" />
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Code</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Diagnosis List ID</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {diagnosisList.map((item) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>{item.id}</CTableDataCell>
                    <CTableDataCell>{item.name}</CTableDataCell>
                    <CTableDataCell>
                      <pre style={{ margin: 0 }}>{JSON.stringify(item.code, null, 2)}</pre>
                    </CTableDataCell>
                    <CTableDataCell>
                      <pre style={{ margin: 0 }}>{JSON.stringify(item.status, null, 2)}</pre>
                    </CTableDataCell>
                    <CTableDataCell>{item.diagnosis_list_id || '-'}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </CCol>
  )
}

export default Diagnosis
