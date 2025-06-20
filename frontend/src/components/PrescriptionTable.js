import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormInput,
  CInputGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMedicalCross, cilSearch } from '@coreui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PrescriptionTable = () => {
  const { eRxNo } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionData, setPrescriptionData] = useState(state?.prescription || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date('2025-04-09'));
  const [endDate, setEndDate] = useState(new Date('2025-04-16'));


  const fetchPrescriptions = async (query = '') => {
    setLoading(true);
    try {
     
      const mockData = [
        {
          erx_no: '683039746868154',
          name: 'MBX_CB_UAT_TSTMEM_SKNL_002 Test',
          member_id: 'MBX-CB_UAT_TSTMEM_SKNL_002',
          payer_tpa: 'Oman Insurance Company',
          created_on: '2025-04-09T14:23:17Z',
        },
      ];


      const filteredData = query
        ? mockData.filter(
            (item) =>
              item.erx_no.includes(query) ||
              item.name.toLowerCase().includes(query.toLowerCase()) ||
              item.member_id.includes(query) ||
              item.payer_tpa.toLowerCase().includes(query.toLowerCase())
          )
        : mockData;

      setPrescriptions(filteredData);
    } catch (error) {
      console.error('Error fetching prescriptions:', error.message);
      setError(error.message);
      setPrescriptions([]);
    }
    setLoading(false);
  };

  
  const fetchPrescriptionDetail = async (eRxNo) => {
    setLoading(true);
    try {
      const url = `http://localhost:8081/prescriptions/${eRxNo}`;
      console.log('Fetching prescription detail from:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch prescription: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPrescriptionData(data);
    } catch (error) {
      console.error('Error fetching prescription data:', error.message);
      setError(error.message);
    }
    setLoading(false);
  };


  useEffect(() => {
    if (!eRxNo && searchTerm.length > 2) {
      fetchPrescriptions(searchTerm);
    } else if (!eRxNo) {
      fetchPrescriptions();
    }
  }, [searchTerm, eRxNo]);


  useEffect(() => {
    if (eRxNo && !prescriptionData) {
      fetchPrescriptionDetail(eRxNo);
    }
  }, [eRxNo, prescriptionData]);


  const renderTableView = () => (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center">
          <span className="fs-3 me-3 cursor-pointer" onClick={() => navigate(-1)}>←</span>
          <div>
            <h1 className="fs-3 mb-0">Prescriptions</h1>
            <div className="text-muted">
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <span className="me-3">
            GARDENPPXUSER459 <span className="d-inline-block w-2 h-2 bg-success rounded-circle ms-1"></span>
          </span>
          <CButton
            color="primary"
            className="me-2"
            onClick={() => fetchPrescriptions(searchTerm)}
          >
            Fetch Prescription
          </CButton>
          <CButton
            color="outline-primary"
            onClick={() => navigate('/prescription-detail-form')}
          >
            <span className="me-1">+</span> New Prescription
          </CButton>
        </div>
      </div>
      <CRow className="mb-3">
        <CCol md={4}>
          <CInputGroup>
            <CFormInput
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CInputGroup>
        </CCol>
        <CCol md={4}>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="form-control"
          />
        </CCol>
        <CCol md={4}>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="form-control"
          />
        </CCol>
      </CRow>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-danger">Error: {error}</div>}
      <CTable striped hover className="shadow-sm">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>eRx Reference #</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Member ID</CTableHeaderCell>
            <CTableHeaderCell>Payer</CTableHeaderCell>
            <CTableHeaderCell>Created On</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {prescriptions.length > 0 ? (
            prescriptions.map((prescription, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{prescription.erx_no || 'N/A'}</CTableDataCell>
                <CTableDataCell>{prescription.name || 'N/A'}</CTableDataCell>
                <CTableDataCell>{prescription.member_id || 'N/A'}</CTableDataCell>
                <CTableDataCell>{prescription.payer_tpa || 'N/A'}</CTableDataCell>
                <CTableDataCell>
                  {prescription.created_on
                    ? new Date(prescription.created_on).toLocaleDateString()
                    : 'N/A'}
                </CTableDataCell>
                <CTableDataCell>
                  <CDropdown>
                    <CDropdownToggle color="link" className="text-muted p-0">
                      ⋮
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem
                        onClick={() =>
                          navigate(`/prescription-detail/${prescription.erx_no}`, {
                            state: { prescription },
                          })
                        }
                      >
                        Prescription Detail
                      </CDropdownItem>
                      <CDropdownItem
                        onClick={() => {
                          alert('Update Prescription functionality coming soon!');
                        }}
                      >
                        Update Prescription
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="6" className="text-center">
                {searchTerm.length > 2 ? 'No prescriptions found' : 'Please enter a search term'}
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );


  const renderDetailView = () => {
    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center mt-5 text-danger">Error: {error}</div>;
    if (!prescriptionData) return <div className="text-center mt-5">No prescription data found</div>;

    return (
      <CCard className="mb-4">
        <CCardHeader>
          Prescription Details
          <CIcon icon={cilMedicalCross} className="ms-2" />
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs={12}>
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Field</CTableHeaderCell>
                    <CTableHeaderCell>Value</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>eRx No</CTableDataCell>
                    <CTableDataCell>{prescriptionData.erx_no || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>eRx Date</CTableDataCell>
                    <CTableDataCell>
                      {prescriptionData.erx_date
                        ? new Date(prescriptionData.erx_date).toLocaleDateString()
                        : 'N/A'}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Prescriber ID</CTableDataCell>
                    <CTableDataCell>{prescriptionData.prescriber_id || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Member ID</CTableDataCell>
                    <CTableDataCell>{prescriptionData.member_id || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Payer TPA</CTableDataCell>
                    <CTableDataCell>{prescriptionData.payer_tpa || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Emirates ID</CTableDataCell>
                    <CTableDataCell>{prescriptionData.emirates_id || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Reason of Unavailability</CTableDataCell>
                    <CTableDataCell>{prescriptionData.reason_of_unavailability || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Name</CTableDataCell>
                    <CTableDataCell>{prescriptionData.name || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Gender</CTableDataCell>
                    <CTableDataCell>{prescriptionData.gender || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Date of Birth</CTableDataCell>
                    <CTableDataCell>
                      {prescriptionData.date_of_birth
                        ? new Date(prescriptionData.date_of_birth).toLocaleDateString()
                        : 'N/A'}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Weight</CTableDataCell>
                    <CTableDataCell>
                      {prescriptionData.weight ? `${prescriptionData.weight} kg` : 'N/A'}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Mobile</CTableDataCell>
                    <CTableDataCell>{prescriptionData.mobile || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Email</CTableDataCell>
                    <CTableDataCell>{prescriptionData.email || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Fill Date</CTableDataCell>
                    <CTableDataCell>
                      {prescriptionData.fill_date
                        ? new Date(prescriptionData.fill_date).toLocaleDateString()
                        : 'N/A'}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Physician</CTableDataCell>
                    <CTableDataCell>{prescriptionData.physician || 'N/A'}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Prescription Date</CTableDataCell>
                    <CTableDataCell>
                      {prescriptionData.prescription_date
                        ? new Date(prescriptionData.prescription_date).toLocaleDateString()
                        : 'N/A'}
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>

          <h4 className="mt-4">Drugs</h4>
          <CRow>
            <CCol xs={12}>
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Drug Code</CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                    <CTableHeaderCell>Days of Supply</CTableHeaderCell>
                    <CTableHeaderCell>Instructions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {prescriptionData.drugs && prescriptionData.drugs.length > 0 ? (
                    prescriptionData.drugs.map((drug, index) => (
                      <CTableRow key={drug.id || index}>
                        <CTableDataCell>{drug.drug_code || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{drug.quantity || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{drug.days_of_supply || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{drug.instructions || 'N/A'}</CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="4" className="text-center">
                        No drugs found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>

          <h4 className="mt-4">Diagnoses</h4>
          <CRow>
            <CCol xs={12}>
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>ICD Code</CTableHeaderCell>
                    <CTableHeaderCell>Diagnosis Code</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Primary</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {prescriptionData.diagnoses && prescriptionData.diagnoses.length > 0 ? (
                    prescriptionData.diagnoses.map((diagnosis, index) => (
                      <CTableRow key={diagnosis.id || index}>
                        <CTableDataCell>{diagnosis.icd_code || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{diagnosis.diagnosis_code || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{diagnosis.description || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          {diagnosis.is_primary ? 'Yes' : 'No'}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="4" className="text-center">
                        No diagnoses found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    );
  };

  return (
    <div className="container-fluid mt-4" style={{ backgroundColor: '#f5f7fa' }}>
      {eRxNo ? renderDetailView() : renderTableView()}
    </div>
  );
};

export default PrescriptionTable;