import axios from "axios";
import React, { useEffect, useState} from "react";

function Dashboard(){

    const [token,  setToken] = useState();
    const  [user,  setUser] = useState("");

    useEffect(()=>{
        setToken(localStorage.getItem('token'));
    }, []);

    useEffect( () =>{
        axios.get("http://localhost:3000/api/userType", getAuthHeaders())
        .then(res => {
            console.log(res);
            setUser(res.data.userType);
        }).catch(e => console.log(e));
    },[token]);

    const getAuthHeaders = () =>{
        console.log(token);
        return {
        headers: {
            Authorization: `Bearer ${token}`
        }}
    };


    return (
        <div>
            {
                user === "tourist" ? <h1>Tourist</h1> : <h1>Nothing</h1>
            }
        </div>
    );
}

export default Dashboard;