import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();

  let history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword , setConfirmPassword] = useState('');


  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

 
  const register = async (formData) => {
    // setRegisterClicked(true);
    console.log("register clicked...");

    // call validate Input
    formData = {
      username: username,
      password: password,
      confirmPassword: confirmPassword,
    };
    console.log(formData);
    const inputValidSuccess = validateInput(formData);

    // console.log("--- inputValid",validInput);

    if (!inputValidSuccess) return;
    // post request on successful input validation

    console.log("Sending Post request ...");

    await axios.post(`${config.endpoint}/auth/register`, {
        username: `${username}`,
        password: `${password}`,
      }).then((response) => {
        const data = response.data;
        console.log(data);
        console.log("complete...");
        // setRegisterSuccess(true);
        enqueueSnackbar('Registered successfully');
        history.push("/login");

      }).catch((error)=>{
        // setRegisterSuccess(false);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          enqueueSnackbar(error.response.data.message);
          console.log(error.response.data);
          console.log(error.response.status);
          // console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON."
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        // console.log(error.config);
      });

    // setRegisterClicked(false);
    // console.log("--- registerSuccess ",registerSuccess);
  }; // end of Register function


  const validateInput = (data) => {
    console.log("--- data object ", data);
    // return true;
    // (data.username.length!==0 && data.password.length>=6 && data.password===data.confirmPassword)
    if (data.username.length === 0) {
      enqueueSnackbar("Username is a required field");
      // setValidInput(false);
      return false;
    } else if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters");
      // setValidInput(false);
      return false;
    } else if (data.password.length === 0) {
      enqueueSnackbar("Password is a required field");
      // setValidInput(false);
      return false;
    } else if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters");
      // setValidInput(false);
      return false;
    } else if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match");
      // setValidInput(false);
      return false;
    } else {
      // setValidInput(true);
      return true;
    }
  }; // end of validateInput function

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
          <h2 className="title">Register</h2>
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
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            onChange={handleConfirmPassword}
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
          />
          <Button onClick={register} className="button" variant="contained">
            Register Now
          </Button>

          <p className="secondary-action">
            Already have an account?{" "}
             <Link className="link" to="/login">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
