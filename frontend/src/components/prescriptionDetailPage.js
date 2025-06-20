import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Spinner from "react-bootstrap/Spinner";
import "./PrescriptionDetailPage.css";

const Prescription_Detail_Page = () => {
  const { id } = useParams();
  const location = useLocation();
  const [prescription_data, set_prescription_data] = useState(null);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState(null);

  useEffect(() => {
    const fetch_prescription = async () => {
      try {
        const mock_data = {
          e_rx_no: "3984522253438230",
          e_rx_date: "2025-02-12",
          name: "PATNEY ANAITA",
          member_id: "BI-6000-0275-4970",
          payer: "Oman Insurance Company",
          created_on: "Feb 12, 2025 5:11:01 PM",
          diagnoses: [
            { icd_code: "A01", is_primary: true },
            { icd_code: "A02", is_primary: true },
          ],
          drug_list: [
            {
              ndc_drug_code: "12345",
              dispensed_quantity: 5,
              days_of_supply: 3,
              instructions: "Take twice daily",
            },
            {
              ndc_drug_code: "12345",
              dispensed_quantity: 70,
              days_of_supply: 8,
              instructions: "Take as needed",
            },
          ],
        };

        if (id === mock_data.e_rx_no) {
          set_prescription_data(mock_data);
        } else {
          throw new Error("Prescription not found");
        }
      } catch (error) {
        set_error(error.message);
      } finally {
        set_loading(false);
      }
    };

    if (id) {
      fetch_prescription();
    } else {
      set_error("No prescription ID provided");
      set_loading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <section className="prescription_detail">
        <div className="container">
          <div className="prescription_detail_inner">
            <div className="prescription_detail_loading">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Loading prescription details...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="prescription_detail">
        <div className="container">
          <div className="prescription_detail_inner">
            <div className="prescription_detail_error alert alert-danger" role="alert">
              <strong>Error:</strong> {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!prescription_data) {
    return (
      <section className="prescription_detail">
        <div className="container">
          <div className="prescription_detail_inner">
            <div className="prescription_detail_warning alert alert-warning" role="alert">
              No prescription data available.
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="prescription_detail">
      <div className="container">
        <div className="prescription_detail_inner">
          <h2 className="prescription_detail_title">Prescription Details</h2>
          <div className="prescription_detail_card">
            <div className="prescription_detail_section">
              <h5 className="prescription_detail_subtitle">eRx Details</h5>
              <p><strong>eRx Number:</strong> {prescription_data.e_rx_no}</p>
              <p><strong>eRx Date:</strong> {prescription_data.e_rx_date}</p>
              <p><strong>Created On:</strong> {prescription_data.created_on}</p>
            </div>

            <div className="prescription_detail_section">
              <h5 className="prescription_detail_subtitle">Member Details</h5>
              <p><strong>Name:</strong> {prescription_data.name}</p>
              <p><strong>Member ID:</strong> {prescription_data.member_id}</p>
              <p><strong>Payer:</strong> {prescription_data.payer}</p>
            </div>

            <div className="prescription_detail_section">
              <h5 className="prescription_detail_subtitle">Diagnoses</h5>
              <ul className="prescription_detail_list">
                {prescription_data.diagnoses?.length > 0 ? (
                  prescription_data.diagnoses.map((diagnosis, index) => (
                    <li key={index}>
                      {diagnosis.icd_code} {diagnosis.is_primary ? "(Primary)" : ""}
                    </li>
                  ))
                ) : (
                  <li>No Diagnoses Available</li>
                )}
              </ul>
            </div>

            <div className="prescription_detail_section">
              <h5 className="prescription_detail_subtitle">Drugs</h5>
              <ul className="prescription_detail_list">
                {prescription_data.drug_list?.length > 0 ? (
                  prescription_data.drug_list.map((drug, index) => (
                    <li key={index}>
                      NDC Code: {drug.ndc_drug_code} - Quantity: {drug.dispensed_quantity}, 
                      Days of Supply: {drug.days_of_supply}, Instructions: {drug.instructions}
                    </li>
                  ))
                ) : (
                  <li>No Drugs Available</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Prescription_Detail_Page;
