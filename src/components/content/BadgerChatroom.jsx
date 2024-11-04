import React, { useEffect, useState, useContext } from "react";
import { Col, Row, Container } from "react-bootstrap";
import BadgerMessage from "./BadgerMessage";
import Pagination from 'react-bootstrap/Pagination';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";
import { Form, Button } from 'react-bootstrap';

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);

    const [activePage, setActivePage] = useState(1);

    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const loadMessages = () => {
        fetch(`https://cs571.org/api/f23/hw6/messages?chatroom=${props.name}&page=${activePage}`, {
            headers: {
                "X-CS571-ID": "bid_5cbd711b381618dba136e5da64626a69b56a791a78532714de51736afee0357d"
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };

    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(loadMessages, [activePage, props]);

    const createPost = () => {
        if (postTitle === "" | postContent === "") {
            alert("You must provide both a title and content!");
        }
        else {
            fetch(`https://cs571.org/api/f23/hw6/messages?chatroom=${props.name}`, {
                method: "POST",
                headers: {
                    "X-CS571-ID": "bid_5cbd711b381618dba136e5da64626a69b56a791a78532714de51736afee0357d",
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    title: postTitle,
                    content: postContent
                })
            }).then(res => {
                alert("Successfully posted!");
                loadMessages();
                return res.json()
            }).catch(error => {
                console.error('Failed to post message.', error);
            });
        }
    };

    const deletePost = (message) => {
        fetch(`https://cs571.org/api/f23/hw6/messages?id=${message.id}`, {
            method: "DELETE",
            headers: {
                "X-CS571-ID": "bid_5cbd711b381618dba136e5da64626a69b56a791a78532714de51736afee0357d",
                "Content-Type": "application/json",
            },
            credentials: "include"
        }).then(res => {
            loadMessages();
            alert("Successfully deleted the post!");
            return res.json()
        }).catch(error => {
            console.error('Failed to delete message.', error);
        });
    }

    const buildPaginator = () => {
        let pages = [];
        const numPages = 4;
        for (let i = 1; i <= numPages; i++) {
            pages.push(
                <Pagination.Item
                    key={i}
                    active={activePage === i}
                    onClick={() => setActivePage(i)}
                >{i}</Pagination.Item>
            )
        };
        return pages;
    }

    return <>
        <h1>{props.name} Chatroom</h1>
        {loginStatus && loginStatus.loggedIn ? 
            <Form>
                <Form.Label htmlFor="postTitle">Post Title</Form.Label>
                    <Form.Control 
                        id="postTitle"
                        value={postTitle}
                        onChange={(e) => {
                            setPostTitle(e.target.value); 
                        }}
                    />
                <Form.Label htmlFor="postContent">Post Content</Form.Label>
                    <Form.Control 
                        id="postContent"
                        value={postContent}
                        onChange={(e) => {
                            setPostContent(e.target.value); 
                        }}
                    />
                <br />
                <Button variant="primary" onClick={createPost}>Create Post</Button>
            </Form> :
            <p>"You must be logged in to post!"</p>
        }
        <hr/>
        {
            messages.length > 0 ?
                <Container fluid>
                    <Row>
                        {
                            messages.map((message, i) => {
                                console.log(message)
                                console.log(props)
                                return <Col sm={12} md={6} lg={4} xxl={3} key={message.id}>
                                    <BadgerMessage 
                                        onClick={() => deletePost(message)} 
                                        {...message}
                                    />
                                </Col>
                            })
                        }
                    </Row>
                </Container>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                </>
        }
        <Pagination>
            {buildPaginator()}
        </Pagination>
    </>
}
