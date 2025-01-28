import { useEffect } from "react";
import { Navigate } from "react-router-dom"

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    localStorage.removeItem("userID")
    localStorage.removeItem("mobileNumber")
    localStorage.removeItem("email")
    localStorage.removeItem("lastName")
    localStorage.removeItem("firstName")
    localStorage.removeItem("userName")

  }, [])
  
  return <Navigate to="/" />;
}

export default Logout;