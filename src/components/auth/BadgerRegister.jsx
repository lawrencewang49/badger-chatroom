import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Button, Form } from 'react-bootstrap';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerRegister() {

    const [createUsername, setUsername] = useState("");
    const [createPassword, setPassword] = useState("");
    const [createRepeatPassword, setRepeatPassword] = useState("");
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const nav = useNavigate();

    const register = () => {
        if (createUsername === "" | createPassword === "") {
            alert("You must provide both a username and password!");
        }
        else if (createPassword !== createRepeatPassword) {
            alert("Your passwords do not match!");
        }
        else {
            fetch(`https://cs571.org/api/f23/hw6/register`, {
                method: "POST",
                headers: {
                    "X-CS571-ID": "bid_5cbd711b381618dba136e5da64626a69b56a791a78532714de51736afee0357d",
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username: createUsername,
                    password: createPassword
                })
            }).then(res => {
                if (res.status === 409) {
                    alert("That username has already been taken!");
                }
                else {
                    const status = {
                        loggedIn: true,
                        username: createUsername
                    };
                    sessionStorage.setItem("loginStatus", JSON.stringify(status));
                    setLoginStatus(status);
                    alert("User successfully registered!");
                    nav("/");
                }
            }).catch(error => {
                console.error('Login error!', error);
            });
        }
    };

    return <>
        <h1>Register</h1>
        <Form>
            <Form.Label htmlFor="createUsername">Username</Form.Label>
            <Form.Control 
                id="createUsername"
                value={createUsername}
                onChange={(e) => {
                    setUsername(e.target.value); 
                }}
            />
            <Form.Label htmlFor="createPassword">Password</Form.Label>
            <Form.Control 
                id="createPassword"
                value={createPassword}
                type="password"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <Form.Label htmlFor="createRepeatPassword">Repeat password</Form.Label>
            <Form.Control 
                id="createRepeatPassword"
                value={createRepeatPassword}
                type="password"
                onChange={(e) => {
                    setRepeatPassword(e.target.value); 
                }}
            />
            <br />
            <Button variant="primary" onClick={register}>Register</Button>
        </Form>
    </>
}
