import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router";

const PrivateRoute = () => {
    const {token} = useAuth();
    return token ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute;