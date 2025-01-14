import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import user from "reducers/user";
import thoughts from "reducers/thoughts";
import { API_URL } from "utils/urls";
import { Button, Container } from "@mui/material";

const Main = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const thoughtItems = useSelector((store) => store.thoughts.items);
    const accessToken = useSelector(store => store.user.accessToken);
    const username = useSelector(store => store.user.username);

    useEffect(()=> {
        if (!accessToken) {
            navigate("/login")
        }
    }, [accessToken]);

    // Fetch thoughts
    useEffect(() => {
        const options = {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            }
        }
        fetch(API_URL("thoughts"), options)
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    dispatch(thoughts.actions.setError(null));
                    dispatch(thoughts.actions.setItems(data.response));
                } else {
                    dispatch(thoughts.actions.setError(response));
                    dispatch(thoughts.actions.setItems([]));
                }
            });
    }, [])

    const onLogoutButtonClick = () => {
        dispatch(user.actions.setAccessToken(null));
        dispatch(user.actions.setUsername(null));
        dispatch(user.actions.setUserId(null));
        dispatch(user.actions.setError(null));
        dispatch(thoughts.actions.setItems([]));
    }

    return (
        <Container component="main" maxWidth="xs" sx={{marginTop: 8}}>  
            {/* <button type="button" onClick={onLogoutButtonClick}>LOGOUT</button> */}
            {username ? (
            <>
                <h2>Welcome {username}!</h2>
                <p>This is a secret page</p></>
            ): ""}
            {/* {thoughtItems.map(item => {
                return(<p key={item._id}>{item.message}</p>)
            })} */}
            {thoughtItems.map((thought) => (
            <section key={thought._id}>
                <p key={thought._id}>{thought.message}</p>
                {/* <div>{formatDistance(new Date(thought.createdAt), Date.now(), { addSuffix: true })}</div> */}
            </section>
        ))}
            <Button 
                type="button" 
                variant="contained"
                onClick={onLogoutButtonClick}>
                Log out
            </Button>
        </Container>
    );
}

export default Main;