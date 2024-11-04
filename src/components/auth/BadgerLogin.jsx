import React, { useRef, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Form, Button } from 'react-bootstrap';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerLogin() {

    const username = useRef();
    const password = useRef();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const nav = useNavigate();

    const login = () => {
        if (!username.current.value | !password.current.value) {
            alert("You must provide both a username and password!");
        }
        else {
            fetch(`https://cs571.org/api/f23/hw6/login`, {
                method: "POST",
                headers: {
                    "X-CS571-ID": "bid_5cbd711b381618dba136e5da64626a69b56a791a78532714de51736afee0357d",
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username: username.current.value,
                    password: password.current.value
                })
            }).then(res => {
                if (res.status === 401) {
                    alert("Incorrect username or password!");
                }
                else {
                    const status = {
                        loggedIn: true,
                        username: username.current.value
                    }
                    sessionStorage.setItem("loginStatus", JSON.stringify(status));
                    setLoginStatus(status);
                    alert("Login successful.");
                    nav("/");
                }
            }).catch(error => {
                console.error('Login error!', error);
            });
        }
    };

    return <>
        <h1>Login</h1>
        <Form>
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control 
                id="username"
                ref={username}
            />
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control 
                id="password"
                type="password"
                ref={password}
            />
            <br />
            <Button variant="primary" onClick={login}>Login</Button>
        </Form>
    </>
}
