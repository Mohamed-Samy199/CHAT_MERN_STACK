import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loader from "../../assets/loader.gif";
import { toast } from "react-toastify";
import "./SetAvatar.modules.scss";

const SetAvatar = ({userData}) => {
    const api = "https://api.multiavatar.com/45678945";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please Select an Avatar");
        }else{
            try {
                const {data} = await axios.post(`http://localhost:5000/user/setAvatar/${userData._id}` , {
                    avatarImage : avatars[selectedAvatar]
                });
            if (data.isSet) {
                userData.isAvatarImageSet = true;
                userData.avatarImage = data.image;
                localStorage.setItem("chat-app-user" , JSON.stringify(userData));
                navigate("/chat");
            }else{
                toast.error("Error setting avatar. Please select again");
            }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
    };
    // console.log(userData.avatarImage);
    // useEffect(()=>{
    //     if (userData?.avatarImage === "") {
    //         navigate("/");
    //     }else{
    //         navigate("/chat");
    //     }
    // },[])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = [];
                const delay = 1000; // Delay in milliseconds between each request

                for (let i = 0; i < 4; i++) {
                    const response = await makeRequestWithBackoff(`${api}/${Math.round(Math.random() * 1000)}`, delay);
                    const base64Image = window.btoa(response.data);
                    data.push(base64Image);
                }

                setAvatars(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching avatars:", error);
                // Handle the error gracefully, e.g. show a message to the user
            }
        };

        fetchData();
    }, []);

    // useEffect(()=> {
    //     if (!localStorage.getItem("chat-app-user")) {
    //         navigate("/login");
    //     }
    // },[]);

    

    const makeRequestWithBackoff = async (url, delay) => {
        for (let attempt = 1; attempt <= 5; attempt++) {
            try {
                const response = await axios.get(url);
                return response;
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    // Too Many Requests error, retry after delay
                    console.warn("Rate limit exceeded. Retrying after delay...");
                    await new Promise((resolve) => setTimeout(resolve, delay));
                } else {
                    throw error; // Throw other errors to be handled in the catch block
                }
            }
        }
        throw new Error("Exceeded maximum number of retry attempts."); // Throw an error if maximum retries reached
    };

    return (
        <div className="setAvatar d-flex justify-content-center align-items-center flex-column gap-3">
            <div className="title-container">
                <h2 className="text-capitalize text-white">pick an avatar as your profile picture</h2>
            </div>
            <div className="avatars d-flex gap-2">
                {isLoading ? (
                    <div className="setAvatar d-flex justify-content-center align-items-center">
                        <img src={loader} alt="loader" className="loader"/>
                    </div>
                ) : (
                    avatars.map((avatar, index) => (
                        <div
                            key={index}
                            className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                            onClick={() => setSelectedAvatar(index)}
                        >
                            <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" />
                        </div>
                    ))
                )}
            </div>
            <button className="btn mt-4" onClick={setProfilePicture}>
                Set as Profile Picture
            </button>
        </div>
    );
};

export default SetAvatar;