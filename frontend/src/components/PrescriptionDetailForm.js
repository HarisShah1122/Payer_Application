import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const PrescriptionDetailForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    insuredMember: "",
    validatedBy: "",
    memberId: "",
    payerTpa: "",
    emiratesId: "",
    reasonOfUnavailability: "",
    name: "",
    gender: "",
    dateOfBirth: "",
    weight: "",
    physician: "",
    mobile: "",
    email: "",
    fillDate: "",
    diagnoses: [],
    drugList: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDiagnosisChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const updatedDiagnoses = [...formData.diagnoses];
    updatedDiagnoses[index][name] = type === "checkbox" ? checked : value;
    setFormData({ ...formData, diagnoses: updatedDiagnoses });
  };

  const handleDrugChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDrugList = [...formData.drugList];
    updatedDrugList[index][name] = value;
    setFormData({ ...formData, drugList: updatedDrugList });
  };

  const handleAddDiagnosis = () => {
    setFormData({
      ...formData,
      diagnoses: [...formData.diagnoses, { icdCode: "", is_primary: false }],
    });
    setModalType("diagnosis");
    setModalOpen(true);
  };

  const handleAddDrug = () => {
    setFormData({
      ...formData,
      drugList: [
        ...formData.drugList,
        { ndcDrugCode: "", dispensedQuantity: "", daysOfSupply: "", instructions: "" },
      ],
    });
    setModalType("drug");
    setModalOpen(true);
  };

  const handleDeleteDrug = async (index, drugId) => {
    if (drugId) {
      try {
        const response = await fetch(`http://localhost:8081/prescription-drugs/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ id: drugId }),
        });
        if (!response.ok) {
          throw new Error("Failed to delete drug");
        }
      } catch (error) {
        console.error("Error deleting drug:", error);
        alert("Failed to delete drug from database");
        return;
      }
    }
    const updatedDrugList = formData.drugList.filter((_, i) => i !== index);
    setFormData({ ...formData, drugList: updatedDrugList });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    const { diagnoses, drugList, ...prescriptionData } = formData;
    console.log("Request Payload:", JSON.stringify(prescriptionData, null, 2));
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      alert("No authentication token found. Please log in.");
      return;
    }
    try {
      // Add Prescription Detail
      const response = await fetch("http://localhost:8081/prescription-detail/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prescriptionData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Server Response:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(errorData?.details || errorData?.error || "Failed to save prescription details");
      }

      const result = await response.json();
      console.log("Success Response:", result);
      const prescriptionId = result.data.id;

      // Add Diagnoses if present
      if (diagnoses.length > 0) {
        for (const diagnosis of diagnoses) {
          if (!diagnosis.icdCode) {
            throw new Error("ICD Code is required for all diagnoses");
          }
          const diagnosisResponse = await fetch("http://localhost:8081/prescription-diagnosis/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              prescription_id: prescriptionId,
              icd_code: diagnosis.icdCode,
              is_primary: diagnosis.is_primary,
            }),
          });

          if (!diagnosisResponse.ok) {
            const errorData = await diagnosisResponse.json().catch(() => null);
            console.error("Failed to add diagnosis:", errorData);
            throw new Error("Failed to add diagnosis");
          }
        }
      }

      // Add Drugs if present
      if (drugList.length > 0) {
        for (const drug of drugList) {
          // Validate required fields
          if (!drug.ndcDrugCode) {
            throw new Error("NDC Drug Code is required for all drugs");
          }
          const quantity = parseInt(drug.dispensedQuantity);
          if (isNaN(quantity) || quantity <= 0) {
            throw new Error("Dispensed Quantity must be a valid positive number for all drugs");
          }
          const daysOfSupply = parseInt(drug.daysOfSupply);
          if (isNaN(daysOfSupply) || daysOfSupply <= 0) {
            throw new Error("Days of Supply must be a valid positive number for all drugs");
          }

          const drugResponse = await fetch("http://localhost:8081/prescription-drugs/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              prescription_id: prescriptionId,
              drug_code: drug.ndcDrugCode,
              quantity: quantity,
              days_of_supply: daysOfSupply,
              instructions: drug.instructions || null, // Ensure instructions can be null
            }),
          });

          if (!drugResponse.ok) {
            const errorData = await drugResponse.json().catch(() => null);
            console.error("Failed to add drug:", errorData);
            throw new Error("Failed to add drug");
          }
        }
      }

      alert("Prescription details saved successfully!");
      navigate("/dashboard/prescription");
    } catch (error) {
      console.error("Network/Error Details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      alert(error.message || "An error occurred while saving the prescription details. Check the console for details.");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType("");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <main className="col-md-12 p-4">
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="card mb-3">
                  <div className="card-header">
                    <h3>Patient Basic Detail</h3>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Insured Member</label>
                        <select className="form-select" name="insuredMember" value={formData.insuredMember} onChange={handleChange} required>
                          <option value="">SELECT</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Validated By</label>
                        <select className="form-select" name="validatedBy" value={formData.validatedBy} onChange={handleChange} required>
                          <option value="">SELECT</option>
                          <option value="User1">User1</option>
                          <option value="User2">User2</option>
                        </select>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Member ID</label>
                        <div className="input-group">
                          <input type="text" className="form-control" name="memberId" value={formData.memberId} onChange={handleChange} required />
                          <button type="button" className="btn btn-success">Validate</button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Payer/TPA</label>
                        <select className="form-select" name="payerTpa" value={formData.payerTpa} onChange={handleChange} required>
                          <option value="">SELECT</option>
                          <option value="Payer1">Payer1</option>
                          <option value="Payer2">Payer2</option>
                        </select>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Emirates ID</label>
                        <div className="input-group">
                          <input type="text" className="form-control" name="emiratesId" value={formData.emiratesId} onChange={handleChange} required />
                          <button type="button" className="btn btn-success">Validate</button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Reason of Unavailability</label>
                        <select className="form-select" name="reasonOfUnavailability" value={formData.reasonOfUnavailability} onChange={handleChange}>
                          <option value="">Select Unavailability Reason</option>
                          <option value="Reason1">Reason1</option>
                          <option value="Reason2">Reason2</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card mb-3">
                  <div className="card-header">
                    <h3>Patient Personal Information</h3>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Name *</label>
                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Gender</label>
                        <div className="d-flex">
                          <div className="form-check me-3">
                            <input type="radio" className="form-check-input" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} id="male" />
                            <label className="form-check-label" htmlFor="male">Male</label>
                          </div>
                          <div className="form-check">
                            <input type="radio" className="form-check-input" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange} id="female" />
                            <label className="form-check-label" htmlFor="female">Female</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Date of Birth *</label>
                        <input type="date" className="form-control" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Weight (Kg)</label>
                        <input type="number" className="form-control" name="weight" value={formData.weight} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Physician *</label>
                        <input type="text" className="form-control" name="physician" value={formData.physician} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Mobile *</label>
                        <input type="text" className="form-control" name="mobile" value={formData.mobile} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Email *</label>
                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Fill Date *</label>
                        <input type="date" className="form-control" name="fillDate" value={formData.fillDate} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card mb-3">
                  <div className="card-header">
                    <h3>Diagnoses</h3>
                  </div>
                  <div className="card-body">
                    {formData.diagnoses.map((diagnosis, index) => (
                      <div key={index} className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-bold">ICD Code</label>
                          <input type="text" className="form-control" name="icdCode" value={diagnosis.icdCode} onChange={(e) => handleDiagnosisChange(e, index)} required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Primary Diagnosis</label>
                          <input type="checkbox" className="form-check-input" name="is_primary" checked={diagnosis.is_primary} onChange={(e) => handleDiagnosisChange(e, index)} />
                        </div>
                      </div>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={handleAddDiagnosis}>Add Diagnosis</button>
                  </div>
                </div>
                <div className="card mb-3">
                  <div className="card-header">
                    <h3>Drugs</h3>
                  </div>
                  <div className="card-body">
                    {formData.drugList.map((drug, index) => (
                      <div key={index} className="row mb-3">
                        <div className="col-md-3">
                          <label className="form-label fw-bold">NDC Drug Code</label>
                          <input type="text" className="form-control" name="ndcDrugCode" value={drug.ndcDrugCode} onChange={(e) => handleDrugChange(e, index)} required />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-bold">Dispensed Quantity</label>
                          <input type="number" className="form-control" name="dispensedQuantity" value={drug.dispensedQuantity} onChange={(e) => handleDrugChange(e, index)} required />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-bold">Days of Supply</label>
                          <input type="number" className="form-control" name="daysOfSupply" value={drug.daysOfSupply} onChange={(e) => handleDrugChange(e, index)} required />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-bold">Instructions</label>
                          <textarea className="form-control" name="instructions" value={drug.instructions} onChange={(e) => handleDrugChange(e, index)} />
                        </div>
                        <div className="col-md-1 d-flex align-items-end">
                          <button type="button" className="btn btn-danger" onClick={() => handleDeleteDrug(index, drug.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={handleAddDrug}>Add Drug</button>
                  </div>
                </div>
                <div className="text-end">
                  <button type="submit" className="btn btn-success">Submit</button>
                </div>
              </form>
            </div>
          </div>
          {modalOpen && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{modalType === "diagnosis" ? "Add Diagnosis" : "Add Drug"}</h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                  </div>
                  <div className="modal-body">
                    {modalType === "diagnosis" ? (
                      <div>
                        <label className="form-label fw-bold">ICD Code</label>
                        <input type="text" className="form-control" name="icdCode" onChange={(e) => handleDiagnosisChange(e, formData.diagnoses.length - 1)} required />
                        <label className="form-label fw-bold mt-3">Primary Diagnosis</label>
                        <input type="checkbox" className="form-check-input" name="is_primary" onChange={(e) => handleDiagnosisChange(e, formData.diagnoses.length - 1)} />
                      </div>
                    ) : (
                      <div>
                        <label className="form-label fw-bold">NDC Drug Code</label>
                        <input type="text" className="form-control" name="ndcDrugCode" onChange={(e) => handleDrugChange(e, formData.drugList.length - 1)} required />
                        <label className="form-label fw-bold mt-3">Dispensed Quantity</label>
                        <input type="number" className="form-control" name="dispensedQuantity" onChange={(e) => handleDrugChange(e, formData.drugList.length - 1)} required />
                        <label className="form-label fw-bold mt-3">Days of Supply</label>
                        <input type="number" className="form-control" name="daysOfSupply" onChange={(e) => handleDrugChange(e, formData.drugList.length - 1)} required />
                        <label className="form-label fw-bold mt-3">Instructions</label>
                        <textarea className="form-control" name="instructions" onChange={(e) => handleDrugChange(e, formData.drugList.length - 1)} />
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={closeModal}>Save</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PrescriptionDetailForm;