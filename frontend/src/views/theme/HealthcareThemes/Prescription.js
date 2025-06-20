import React, { useEffect, useState } from "react";
import { CRow, CCol, CCard, CCardHeader, CCardBody } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMedicalCross } from "@coreui/icons";

const PrescriptionTable = () => {
  const [prescriptionData, setPrescriptionData] = useState(null);

  useEffect(() => {

    fetch("http://localhost:8081/prescriptions/08b7ccfa-a3ba-4195-8716-23bfbe1ce93b")
      .then((response) => response.json())
      .then((data) => setPrescriptionData(data))
      .catch((error) => console.error("Error fetching prescription data:", error));
  }, []);

  if (!prescriptionData) {
    return <div>Loading...</div>;
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        Prescription Details
        <CIcon icon={cilMedicalCross} className="me-2" />
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol xs={12}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>eRx No</td>
                  <td>{prescriptionData.erx_no}</td>
                </tr>
                <tr>
                  <td>eRx Date</td>
                  <td>{new Date(prescriptionData.erx_date).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td>Prescriber ID</td>
                  <td>{prescriptionData.prescriber_id}</td>
                </tr>
                <tr>
                  <td>Member ID</td>
                  <td>{prescriptionData.member_id}</td>
                </tr>
                <tr>
                  <td>Payer TPA</td>
                  <td>{prescriptionData.payer_tpa}</td>
                </tr>
                <tr>
                  <td>Emirates ID</td>
                  <td>{prescriptionData.emirates_id}</td>
                </tr>
                <tr>
                  <td>Reason of Unavailability</td>
                  <td>{prescriptionData.reason_of_unavailability}</td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>{prescriptionData.name}</td>
                </tr>
                <tr>
                  <td>Gender</td>
                  <td>{prescriptionData.gender}</td>
                </tr>
                <tr>
                  <td>Date of Birth</td>
                  <td>{new Date(prescriptionData.date_of_birth).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td>Weight</td>
                  <td>{prescriptionData.weight} kg</td>
                </tr>
                <tr>
                  <td>Mobile</td>
                  <td>{prescriptionData.mobile}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{prescriptionData.email}</td>
                </tr>
                <tr>
                  <td>Fill Date</td>
                  <td>{new Date(prescriptionData.fill_date).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td>Physician</td>
                  <td>{prescriptionData.physician}</td>
                </tr>
                <tr>
                  <td>Prescription Date</td>
                  <td>{new Date(prescriptionData.prescription_date).toLocaleDateString()}</td>
                </tr>
              </tbody>
            </table>
          </CCol>
        </CRow>

        <h4>Drugs</h4>
        <CRow>
          <CCol xs={12}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Drug Code</th>
                  <th>Quantity</th>
                  <th>Days of Supply</th>
                  <th>Instructions</th>
                </tr>
              </thead>
              <tbody>
              {prescriptionData.drugs && prescriptionData.drugs.map((drug) => (
                  <tr key={drug.id}>
                    <td>{drug.drug_code}</td>
                    <td>{drug.quantity}</td>
                    <td>{drug.days_of_supply}</td>
                    <td>{drug.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CCol>
        </CRow>

        <h4>Diagnoses</h4>
        <CRow>
          <CCol xs={12}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ICD Code</th>
                  <th>Diagnosis Code</th>
                  <th>Description</th>
                  <th>Primary</th>
                </tr>
              </thead>
              <tbody>
              {prescriptionData.diagnoses && prescriptionData.diagnoses.map((diagnosis) => (
                <tr key={diagnosis.id}>
                  <td>{diagnosis.icd_code}</td>
                  <td>{diagnosis.diagnosis_code}</td>
                  <td>{diagnosis.description}</td>
                  <td>{diagnosis.is_primary ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>

            </table>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default PrescriptionTable;
