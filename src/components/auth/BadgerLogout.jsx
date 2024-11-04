import React, { useEffect, useContext } from 'react';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";
import { useNavigate } from 'react-router';

export default function BadgerLogout() {

    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const nav = useNavigate();

    useEffect(() => {
        fetch('https://cs571.org/api/f23/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": "bid_5cbd711b381618dba136e5da64626a69b56a791a78532714de51736afee0357d",
                "Content-Type": "application/json",
            },
            credentials: "include"
        }).then(res => res.json()).then(json => {
            alert("You have been logged out!");
            sessionStorage.removeItem("loginStatus");
            const status = {
                loggedIn: false,
                username: ""
            }
            setLoginStatus(status);
            nav("/");
        })
    }, []);

    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}
