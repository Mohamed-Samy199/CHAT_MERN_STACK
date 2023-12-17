import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import MainLayout from "./components/MainLayout/MainLayout";
import Chat from "./components/Chat/Chat";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import NotFound from "./components/Notfound/NotFound";
import { ToastContainer } from "react-toastify";
import {  useEffect, useState } from "react";
import SetAvatar from "./components/SetAvatar/SetAvatar";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const [userData, setUserData] = useState(null);
    const saveUserData = () => {
        let encodeToken = localStorage.getItem("token");
        let decodeToken = jwtDecode(encodeToken);
        setUserData(decodeToken);
    }
    useEffect(() => {
        if (localStorage.getItem("token")) {
            saveUserData();
        }
    }, []);

    let logout = () => {
        localStorage.removeItem("token");
        setUserData(null);
        return <Navigate to="/login" />
    }
  
  let routes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout userData={userData} />,
      children: [
        { index: true, element: <SetAvatar userData={userData} /> },
        { path: "chat", element: <Chat userData={userData} logout={logout} /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login saveUserData={saveUserData} userData={userData} /> },
        { path: "*", element: <NotFound /> }
      ]
    }
  ])
  return (
    <div>
      <ToastContainer theme="dark" />
      <RouterProvider router={routes} />
    </div>
  )
}

export default App;