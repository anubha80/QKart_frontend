import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import React, {Fragment, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
    // use State for loggedIn status
    let history = useHistory();

    //props
    const status= hasHiddenAuthButtons['status'];
    const user=hasHiddenAuthButtons['user'];
    // console.log(hasHiddenAuthButtons);
    // console.log(hasHiddenAuthButtons.status);
    // console.log(hasHiddenAuthButtons.user);
    // console.log(Object.entries(hasHiddenAuthButtons.user).length === 0);

    function handleLogout () {
      localStorage.removeItem('username');
      localStorage.removeItem('balance');
      localStorage.removeItem('token');
      window.location.reload();
      history.push("/");

    }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box> 
        {children}
          {
            hasHiddenAuthButtons.status && Object.entries(hasHiddenAuthButtons.user).length === 0 && <Box><Link className="link" to="/login"><Button>Login</Button></Link><Link className="link" to="/register"><Button>Register</Button></Link></Box>
          }
          {
            hasHiddenAuthButtons.status && Object.entries(hasHiddenAuthButtons.user).length !== 0 && <Grid><Grid container direction="row" justifyContent="center" alignItems="center"><Grid><img className="avatar" alt={hasHiddenAuthButtons.user.userLoggedin} src="avatar.png"></img></Grid> <Grid>{hasHiddenAuthButtons.user.userLoggedin}</Grid> <Grid><Button onClick={handleLogout}>Logout</Button></Grid></Grid></Grid>
          }

          
          {/* for login and regsiter page header  */}
          {
            !hasHiddenAuthButtons.status && <Link to="/">
          <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
          >
            Back to explore
          </Button> 
          </Link>
          }
      </Box>
    );
};

export default Header;
