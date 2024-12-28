import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import logo from "../img/logo_2.png";
import ButtonBase from "@mui/material/ButtonBase";
import { AuthContext } from "../context/authContext";

const NavBar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetching token and admin status on component mount
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setIsAdmin(localStorage.getItem("isAdmin") === "true"); // Ensure `isAdmin` is a boolean
  }, []); // Empty dependency array ensures this only runs once

  const { logout } = useContext(AuthContext); // Using context for logout function
  const addedItems = useSelector((state) => state.cartStore.addedItems); // Cart items from Redux store

  const goToHome = () => {
    navigate("/");
  };

  const goToAddProduct = () => {
    navigate("/addProduct");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const goToOrders = () => {
    navigate("/orders");
  };

  const logOut = () => {
    localStorage.clear();
    setToken(null);
    setIsAdmin(false);
    logout(); // Calling logout from context
    navigate("/"); // Redirect to home after logout
  };

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ background: "#38B6FF" }}>
          <Toolbar>
            <ButtonBase onClick={goToHome}>
              <Box
                component="img"
                sx={{ width: "8rem", height: "5rem" }}
                src={logo}
              />
            </ButtonBase>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />

            <IconButton onClick={goToOrders}>
              <Badge badgeContent={addedItems.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {isAdmin && (
              <Button color="inherit" onClick={goToAddProduct}>
                Add product
              </Button>
            )}

            {!token ? (
              <Button color="inherit" onClick={goToLogin}>
                Login
              </Button>
            ) : (
              <Button color="inherit" onClick={logOut}>
                LogOut
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </React.Fragment>
  );
};

export default NavBar;
