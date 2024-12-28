import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { Grid, Button, Paper, TableCell, TableContainer, TableRow, TableHead, TableBody, Table, IconButton, Typography, Stack, Card, TextField, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Avatar from "@mui/material/Avatar";
import NavBar from "../components/NavBar";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import FlagIcon from "@mui/icons-material/Flag";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MarkunreadMailbox from "@mui/icons-material/MarkunreadMailbox";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import emptyCartImg from "../img/emptycart.png";
import axios from "axios";

// Dialog imports
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

// Redux actions (assuming you have these actions defined)
import { removeFromCart, addToCart, emptyCart } from "../store/cart/cartActions";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  const addedItems = useSelector((state) => state.cartStore.addedItems);
  const total = useSelector((state) => state.cartStore.total);
  
  const [totalAmount, setTotalAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [accountDialog, setAccountDialog] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  });

  useEffect(() => {
    if (total !== undefined) {
      setTotalAmount(`$${total.toFixed(2)}`);
    }
  }, [total, addedItems]);

  const goBack = () => {
    navigate("/");
  };

  const cartItemRemoveHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const cartItemAddHandler = (item) => {
    const product_item = {
      product: item,
      amount: 1,
    };
    dispatch(addToCart(product_item));
  };

  const handleCheckout = async () => {
    if (!authContext.token) {
      setOpen(true);
    } else {
      setConfirmShow(true);
    }
  };

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    setCheckoutForm({ ...checkoutForm, [name]: value });
  };

  const handleGoToLogin = () => {
    setShowLogin(true);
    setAccountDialog(true);
    setOpen(false);
  };

  const handleCreateAccount = () => {
    setShowLogin(false);
    setAccountDialog(true);
    setOpen(false);
  };

  const handleCloseAccountDialog = async () => {
    setAccountDialog(false);
    setConfirmShow(true);
  };

  const handleCancel = () => {
    setConfirmShow(false);
  };

  const handleConfirm = async () => {
    const order = {
      userID: localStorage.getItem("userId"),
      firstName: checkoutForm.firstName,
      lastName: checkoutForm.lastName,
      address: checkoutForm.address,
      city: checkoutForm.city,
      country: checkoutForm.country,
      zipCode: checkoutForm.zipCode,
      totalAmount: totalAmount,
      items: addedItems,
      createdDate: new Date(),
    };

    try {
      const response = await axios.post("http://localhost:5000/order/create", { data: order });
      if (response.data === "Order saved to the database!") {
        dispatch(emptyCart());
        setConfirmShow(false);
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
    console.log(order);
  };

  return (
    <div>
      <NavBar />
      <Grid container direction="column" alignItems="center" spacing={3}>
        {addedItems.length === 0 ? (
          <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
            <img src={emptyCartImg} alt="empty cart" />
            <Typography variant="h6">Your cart is empty</Typography>
            <Button variant="outlined" color="primary" onClick={goBack}>Go Back</Button>
          </Paper>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addedItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Avatar src={item.product.images} />
                        <Typography>{item.product.title}</Typography>
                      </TableCell>
                      <TableCell>{item.product.price}$</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconButton onClick={() => cartItemRemoveHandler(item.product._id)}>
                            <RemoveIcon />
                          </IconButton>
                          <Typography>{item.amount}</Typography>
                          <IconButton onClick={() => cartItemAddHandler(item.product)}>
                            <AddIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => cartItemRemoveHandler(item.product._id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ marginTop: 2 }}>
              <Typography variant="h6">Total: {totalAmount}</Typography>
              <Button variant="contained" color="primary" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </Stack>
          </>
        )}
      </Grid>

      {/* Checkout dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Please login to proceed with the checkout.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGoToLogin} color="primary">
            Login
          </Button>
          <Button onClick={handleCreateAccount} color="secondary">
            Create Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Checkout dialog */}
      <Dialog open={confirmShow} onClose={handleCancel}>
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Please fill in your details:</Typography>
          <TextField
            label="First Name"
            name="firstName"
            value={checkoutForm.firstName}
            onChange={handleFormInput}
            fullWidth
            sx={{ marginTop: 2 }}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={checkoutForm.lastName}
            onChange={handleFormInput}
            fullWidth
            sx={{ marginTop: 2 }}
          />
          {/* Additional fields: address, city, etc. */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CartPage;
