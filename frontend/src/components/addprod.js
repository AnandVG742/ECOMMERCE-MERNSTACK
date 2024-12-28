import React, { useState } from "react";
import { Grid, Paper, TextField, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const AddProduct = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
      title: "",
      brand: "",
      category: "",
      description: "",
      discountPercentage: "",
      images: "",
      price: "",
      rating: "",
      stock: "",
      thumbnail: "",
    });
    const handleInputChanges = (event) => {
        const { name, value } = event.target;
      
        setProductData({ ...productData, [name]: value });
      };
      const handleSave = async () => {
        console.log(productData);
        try {
          const response = await axios.post("http://localhost:5000/create", {
            data: productData,
          });
          if (response.data === "Product saved to the database!") {
            navigate("/");
          }
        } catch (e) {
          console.log(e);
        }
      };}