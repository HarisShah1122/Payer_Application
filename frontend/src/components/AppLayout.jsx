import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderToggler,
  CSidebar,
  CSidebarNav,
  CSidebarToggler,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CNavLink,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilExternalLink } from '@coreui/icons';
import { navItems } from './nav'; // Import nav configuration
import PrescriptionTable from './PrescriptionTable';

const AppLayout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className="wrapper flex flex-col min-h-screen bg-gray-100">
      {/* Sticky Navbar */}
      <CHeader position="sticky" className="mb-4 shadow-sm bg-white top-0 z-10">
        <CHeaderToggler
          className="ps-1"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          <CIcon icon={cilExternalLink} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <span className="text-xl font-bold">Prescription Dashboard</span>
        </CHeaderBrand>
        <CHeaderNav className="ms-auto me-4">
          <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
              <span className="flex items-center">
                GARDENPPXUSER459
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
              </span>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0">
              <CDropdownItem href="#" onClick={() => alert('Profile settings')}>
                Profile
              </CDropdownItem>
              <CDropdownItem href="#" onClick={() => alert('Logout')}>
                Logout
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
      </CHeader>

      {/* Main Content with Sticky Sidebar */}
      <div className="body flex flex-grow-1">
        <CSidebar
          className="border-end"
          colorScheme="light"
          position="fixed"
          visible={sidebarVisible}
          onVisibleChange={(visible) => setSidebarVisible(visible)}
          style={{ height: 'calc(100vh - 60px)', top: '60px' }} // Adjust for navbar height
        >
          <CSidebarNav>
            {navItems.map((item, index) => {
              const Component = item.component;
              return (
                <Component
                  key={index}
                  {...(item.to ? { to: item.to } : {})}
                  {...(item.icon ? { icon: item.icon } : {})}
                  {...(item.badge ? { badge: item.badge } : {})}
                >
                  {item.to ? (
                    <CNavLink to={item.to}>{item.name}</CNavLink>
                  ) : (
                    item.name
                  )}
                </Component>
              );
            })}
          </CSidebarNav>
          <CSidebarToggler />
        </CSidebar>

        {/* Main Content Area */}
        <div
          className="flex-grow-1 p-3 transition-all duration-300"
          style={{
            marginLeft: sidebarVisible ? '250px' : '0',
            paddingTop: '20px',
          }}
        >
          <Routes>
            <Route path="/dashboard/prescription" element={<PrescriptionTable />} />
            <Route path="/dashboard/prescription-detail/:eRxNo" element={<PrescriptionTable />} />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            <Route path="/dashboard/health-authority" element={<div>Health Authority Page</div>} />
            <Route path="/dashboard/drugs" element={<div>Drugs Page</div>} />
            <Route path="/dashboard/diagnosis" element={<div>Diagnosis Page</div>} />
            <Route path="/dashboard/pharmacies" element={<div>Pharmacies Page</div>} />
            <Route path="/theme/colors" element={<div>Colors Page</div>} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;