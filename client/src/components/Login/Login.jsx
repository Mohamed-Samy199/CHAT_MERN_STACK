import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "../../assets/logo.svg";
import "../Register/Register.modules.scss";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ saveUserData, userData }) => {
    const navigate = useNavigate();
    const notify = (msg, type) => toast[type](msg);

    let validationSchema = Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().matches(/^[A-Z][a-z0-9@$%^&*]{3,}$/, 'password must match the pattern must start by capital letter').required(),
    })
    let loginFormik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: (values) => {
            axios.post("http://localhost:5000/user/login", values)
                .then((data) => {
                    if (data.status === 200) {
                        localStorage.setItem("token", data.data.access_token);
                        saveUserData()
                        notify(`Welcome ${userData?.userName}`, "success")
                        navigate('/');
                    }

                })
                .catch((error) => {
                    if (error) {
                        notify(error.response.data.message, 'error')
                    }
                })
        }
    })
    return (
        <div className="register login d-flex justify-content-center align-items-center flex-column gap-3">
            <form onSubmit={loginFormik.handleSubmit} className="d-flex justify-content-center align-items-center flex-column gap-2">
                <header className="d-flex justify-content-center align-items-center gap-3">
                    <img src={logo} alt="logo" className="img-fluid" />
                    <h1 className="text-white text-uppercase">SNAPPY</h1>
                </header>
                <div className=" w-100">
                    <input type="email" placeholder="Email" name="email" className="form-control my-3"
                        onChange={loginFormik.handleChange} onBlur={loginFormik.handleBlur} value={loginFormik.values.email} />
                    {
                        loginFormik.errors.email && loginFormik.touched.email ?
                            <div className="alert alert-danger">{loginFormik.errors.email}</div>
                            : ""
                    }
                </div>
                <div className=" w-100">
                    <input type="password" placeholder="Password" name="password" className="form-control my-3"
                        onChange={loginFormik.handleChange} onBlur={loginFormik.handleBlur} value={loginFormik.values.password} />
                    {
                        loginFormik.errors.password && loginFormik.touched.password ?
                            <div className="alert alert-danger">{loginFormik.errors.password}</div>
                            : ""
                    }
                </div>
                <div className=" w-100">
                    <button className="btn w-100" disabled={!(loginFormik.dirty && loginFormik.isValid)}>Login</button>

                </div>
                <div className="w-100 mt-3">
                    <p className="text-white text-uppercase pt-2">Don't have an account ? <span><Link to="/register">register</Link></span></p>
                </div>
            </form>
        </div>
    )
}

export default Login;