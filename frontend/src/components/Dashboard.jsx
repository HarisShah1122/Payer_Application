import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CButton, CContainer, CRow, CCol } from '@coreui/react';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to login
  };

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={8}>
          <h1>Dashboard</h1>
          <p>Welcome to the dashboard!</p>
          <CButton color="danger" onClick={handleLogout}>
            Logout
          </CButton>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Dashboard;