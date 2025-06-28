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
                        <Route path="/users" element={<Users />}/>
                    ]}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
