import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "../../assets/logo.svg";
import "./Register.modules.scss";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
    const navigate = useNavigate();
    const notify = (msg, type) => toast[type](msg);

    let validationSchema = Yup.object({
        userName: Yup.string().max(30).required(),
        email: Yup.string().email().required(),
        password: Yup.string().matches(/^[A-Z][a-z0-9@$%^&*]{3,}$/, 'password must match the pattern must start by capital letter').required(),
    })
    let registerFormik = useFormik({
        initialValues: {
            userName: '',
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: (values) => {
            axios.post("http://localhost:5000/user/register", values)
                .then((data) => {
                    if (data.status === 201) {
                        notify("success", "success")
                        navigate('/login');
                    }
                })
                .catch((error) => {
                    if (error || error.response.status == 409) {
                        notify(error.response.data.message, 'error')
                    }
                })
        }
    })
    return (
        <div className="register d-flex justify-content-center align-items-center flex-column gap-3">
            <form onSubmit={registerFormik.handleSubmit} className="d-flex justify-content-center align-items-center flex-column gap-2">
                <header className="d-flex justify-content-center align-items-center gap-3">
                    <img src={logo} alt="logo" className="img-fluid" />
                    <h1 className="text-white text-uppercase">SNAPPY</h1>
                </header>
                <div className="w-100">
                    <input type="text" placeholder="Username" name="userName" className="form-control my-3"
                        onChange={registerFormik.handleChange} onBlur={registerFormik.handleBlur} value={registerFormik.values.userName} />
                    {
                        registerFormik.errors.userName && registerFormik.touched.userName ?
                            <div className="alert alert-danger">{registerFormik.errors.userName}</div>
                            : ""
                    }
                </div>
                <div className=" w-100">
                    <input type="email" placeholder="Email" name="email" className="form-control my-3"
                        onChange={registerFormik.handleChange} onBlur={registerFormik.handleBlur} value={registerFormik.values.email} />
                    {
                        registerFormik.errors.email && registerFormik.touched.email ?
                            <div className="alert alert-danger">{registerFormik.errors.email}</div>
                            : ""
                    }
                </div>
                <div className=" w-100">
                    <input type="password" placeholder="Password" name="password" className="form-control my-3"
                        onChange={registerFormik.handleChange} onBlur={registerFormik.handleBlur} value={registerFormik.values.password} />
                    {
                        registerFormik.errors.password && registerFormik.touched.password ?
                            <div className="alert alert-danger">{registerFormik.errors.password}</div>
                            : ""
                    }
                </div>
                <div className=" w-100">
                    <button className="btn w-100" disabled={!(registerFormik.dirty && registerFormik.isValid)}>Register</button>
                </div>
                <div className="w-100 mt-3">
                    <p className="text-white text-uppercase pt-2">Already have an account? <span><Link to="/login">login</Link></span></p>
                </div>
            </form>
        </div>
    )
}

export default Register
