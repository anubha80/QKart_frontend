import { Warning } from "@mui/icons-material";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  let history = useHistory();

  // states for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);



  // loading 
  const showLoading = () =>{
    return (<CircularProgress />);
  }


  // set time out 
  


  // handle change in username and password 
  const handleUsername = (e) =>{
    setUsername(e.target.value);
  }

  const handlePassword = (e) =>{
    setPassword(e.target.value);
  }

  //check login valid and perform login
  const login = async (formData) => {
    setLoading(true);
    console.log("--- calling validateInput function")
    const validInputCheck = validateInput({
      "username":username,
      "password":password
    });
    console.log("---validInputCheck ",validInputCheck);
    if(validInputCheck){
      //post request
      console.log("Post request...")
      await axios.post(`${config.endpoint}/auth/login`,{
        username:`${username}`,
        password : `${password}`
      }).then((response)=>{
        console.log(response.data);
        console.log(response.data.success);
        console.log(response.data.username);
        console.log(response.data.balance);
        console.log(response.data.token);
        console.log(response.status);
        enqueueSnackbar("Logged in successfully",{variant: "success"});
        // call persist login 
        // to store response in 
        // local storage
        persistLogin(response.data.token, response.data.username, response.data.balance)
        // redirect to 
        // products page 
        history.push("/");

      }).catch((error)=>{
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          enqueueSnackbar(error.response.data.message);
          console.log(error.response.data);
          console.log(error.response.status);
          // console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
          enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON.',{variant: "error"});
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
          enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON.',{variant: "error"});
        }
      }); 
    }
    setLoading(false);
  };



  const validateInput = (data) => {
    console.log("---data ",data);
    if(data.username===""){
      enqueueSnackbar("Username Required", {variant: "warning"});
      return false;
    }
    else if (data.password===""){
      enqueueSnackbar('Password Required',{variant: "warning"});
      return false;
    }
    else{
      return true;
    }
  };

  const persistLogin = (token, username, balance) => {
        // storing data 
        // in the local storage 
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
        localStorage.setItem('balance', balance);
        console.log("--- data stored to localStorage");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={{status:false,user:{}}} />
      <Box className="content">
        <Stack spacing={2} className="form">
        <h1 className="title">Login</h1>
        {/* <input label="username" onChange={handleUsername} className="secondary-action" placeholder="Username" type="text" id="username" name="username"/> <br />
        <input label="password" onChange={handlePassword}  className="secondary-action" placeholder="Password" type="password" id="password" name="password"/> <br /> */}
        <TextField
            id="username"
            onChange={handleUsername}
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            onChange={handlePassword}
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />

        {loading && showLoading()}
        {!loading && <button onClick={login}  className="button secondary-action">LOGIN TO QKART</button>}
        
        {/* <p>Don’t have an account? <a className="link" href="#">Register Now</a> </p> */}
        <p>Don’t have an account? <Link className="link" to="/register">Register Now</Link> </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
