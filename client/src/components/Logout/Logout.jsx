import { useNavigate } from "react-router-dom";

const Logout = ({ logout }) => {
    let navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <h4
            onClick={handleLogout}
            style={{ backgroundColor: "#997af0", cursor: "pointer" }}
            className="d-flex p-2 justify-content-center align-items-center rounded-2 border-0 text-white me-3"
        >
            <i className="fa-solid fa-power-off"></i>
        </h4>
    );
};

export default Logout;