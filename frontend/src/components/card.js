import React from "react";
import CardActions from "@mui/material/CardActions";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductActions = (props) => {
  const navigate = useNavigate();

  const handleUpdate = (id) => {
    navigate(`/update/${id}`); 
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/delete/${id}`); 
            console.log(response.data);
      if (response.data === "Product deleted!") {
        props.getProduct && props.getProduct();       }
    } catch (e) {
      console.error("Error deleting product:", e);
       }
  };

  return (
    <CardActions>
      <Button variant="contained" color="primary" onClick={() => handleUpdate(props.id)}>
        Update
      </Button>
      <Button variant="contained" color="secondary" onClick={() => handleDelete(props.id)}>
        Delete
      </Button>
    </CardActions>
  );
};

export default ProductActions;
