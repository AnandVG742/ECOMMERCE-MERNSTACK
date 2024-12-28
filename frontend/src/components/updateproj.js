import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/get/${id}`
      );
      setProductData(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setSnackbar({ open: true, message: "Failed to fetch product", severity: "error" });
    }
  };

  const handleInputChanges = (event) => {
    const { name, value } = event.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/update/${id}`,
        { data: productData }
      );
      if (response.data === "Product updated successfully!") {
        setSnackbar({ open: true, message: "Product updated successfully!", severity: "success" });
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setSnackbar({ open: true, message: "Failed to update product", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Grid
        container
        alignContent="center"
        justifyContent="center"
        style={{ paddingTop: "50px" }}
      >
        <Paper
          elevation={3}
          sx={{ width: 550, padding: 4, marginBottom: 4 }}
        >
          <Grid container direction="column" alignItems="center" gap={3}>
            <Typography variant="h5">Update Product</Typography>

            <Grid container direction="row" gap={3}>
              <Grid item>
                <Grid container direction="column" gap={2}>
                  <TextField
                    label="Title"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={productData.title || ""}
                    name="title"
                    onChange={handleInputChanges}
                    required
                  />
                  <TextField
                    label="Brand"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={productData.brand || ""}
                    name="brand"
                    onChange={handleInputChanges}
                    required
                  />
                  <TextField
                    label="Category"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={productData.category || ""}
                    name="category"
                    onChange={handleInputChanges}
                  />
                  <TextField
                    label="Description"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={productData.description || ""}
                    name="description"
                    onChange={handleInputChanges}
                  />
                  <TextField
                    label="Discount Percentage"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    type="number"
                    value={productData.discountPercentage || ""}
                    name="discountPercentage"
                    onChange={handleInputChanges}
                  />
                </Grid>
              </Grid>

              <Grid item>
                <Grid container direction="column" gap={2}>
                  <TextField
                    label="Image Link"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={productData.images || ""}
                    name="images"
                    onChange={handleInputChanges}
                  />
                  <TextField
                    label="Price"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    type="number"
                    value={productData.price || ""}
                    name="price"
                    onChange={handleInputChanges}
                  />
                  <TextField
                    label="Rating"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    type="number"
                    value={productData.rating || ""}
                    name="rating"
                    onChange={handleInputChanges}
                  />
                  <TextField
                    label="Stock"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    type="number"
                    value={productData.stock || ""}
                    name="stock"
                    onChange={handleInputChanges}
                  />
                  <TextField
                    label="Thumbnail"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={productData.thumbnail || ""}
                    name="thumbnail"
                    onChange={handleInputChanges}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </Grid>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Grid>
    </React.Fragment>
  );
};

export default UpdateProduct;
