import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Guest/Login";
import Layout from "./Auth/Layout";
import Dashboard from "./Auth/Dashboard/Dashboard";
import Scholars from "./Auth/Scholar/Scholars";
import CreateScholars from "./Auth/Scholar/CreateScholarForm/CreateScholar";
import Payroll from "./Auth/Payroll/Payroll";
import EditScholar from "./Auth/Scholar/EditScholar/EditScholar";
import CreatePayroll from "./Auth/Payroll/CreatePayroll/CreatePayroll";
import Users from "./Users/Users";
import ServicePeriods from "./Service_Periods/ServicePeriods";
import Signatories from "./Auth/Signatories/Signatories";
import AuditTrail from "./Audit_Trail/AuditTrail";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={"/login"} />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={<Layout />}
                    children={[
                        <Route path="/dashboard" element={<Dashboard />} />,
                        <Route path="/scholars" element={<Scholars />} />,
                        <Route path="/scholars/:id/edit" element={<EditScholar />} />,
                        <Route
                            path="/scholars/create"
                            element={<CreateScholars />}
                        />,
                        <Route path="/payrolls" element={<Payroll />} />,
                        <Route path="/payrolls/create" element={<CreatePayroll />} />,
                        <Route path="/users" element={<Users />}/>,
                        <Route path="/service_periods" element={<ServicePeriods />}/>,
                        <Route path="/signatories" element={<Signatories />} />,
                        <Route path="/audit_trails" element={<AuditTrail />} />,
                    ]}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
