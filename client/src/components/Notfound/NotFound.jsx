import notFound from "../../assets/404-error-page-3959253-3299952.gif"
const NotFound = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", width: "100vw", backgroundColor: "#000311" }}>
            <img src={notFound} alt="404" />
        </div>
    )
}

export default NotFound;