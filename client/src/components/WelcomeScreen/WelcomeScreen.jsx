import robote from "../../assets/robot.gif";

const WelcomeScreen = ({ currentUser }) => {
    return (
        <div className="welcome-screen d-flex justify-content-center align-items-center flex-column text-white">
            <img src={robote} alt="welcome-screen" style={{ height: "20rem" }} />
            <h2>Welcome, <span style={{ color: "#4e00ff" }}>{currentUser.userName}!</span></h2>
            <h4>Please select a chat to start messaging.</h4>
        </div>
    )
}

export default WelcomeScreen;