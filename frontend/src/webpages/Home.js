import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import not_found_pic from "../img/not_found.png";
import SearchComponent from "../filterComponents/SearchComponent";
import SortComponent from "../filterComponents/SortComponent";
import CategoryComponent from "../filterComponents/CategoryComponent";
import ProductCard from "../components/ProductCard";

const pageSize = 10;

const HomePage = () => {
  const [productList, setProductList] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [category, setCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState({ count: 0, page: 1 });
  const [sortValue, setSortValue] = useState("Select value");

  // Fetch products
  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const response = await axios.get("http://localhost:5000/product");
      setProductList(response.data);
      setOriginalData(response.data);
      setPagination({ ...pagination, count: response.data.length });
    } catch (e) {
      console.log(e);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
    filterProducts(value, category, sortValue);
  };

  // Handle category change
  const handleCatChange = (value) => {
    setCategory(value);
    filterProducts(searchValue, value, sortValue);
  };

  // Handle sorting
  const handleSort = (value) => {
    setSortValue(value);
    filterProducts(searchValue, category, value);
  };

  // Filter products based on search, category, and sorting
  const filterProducts = (search, category, sort) => {
    let filteredList = [...originalData];

    // Apply search filter
    if (search) {
      filteredList = filteredList.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (category !== "all") {
      filteredList = filteredList.filter((item) => item.category === category);
    }

    // Apply sorting
    if (sort === "ascendingprice") {
      filteredList = filteredList.sort((a, b) => a.price - b.price);
    } else if (sort === "descendingprice") {
      filteredList = filteredList.sort((a, b) => b.price - a.price);
    } else if (sort === "ascendingrating") {
      filteredList = filteredList.sort((a, b) => a.rating - b.rating);
    } else if (sort === "descendingrating") {
      filteredList = filteredList.sort((a, b) => b.rating - a.rating);
    } else if (sort === "ascpricediscount") {
      filteredList = filteredList.sort((a, b) => a.discountPercentage - b.discountPercentage);
    } else if (sort === "descpricediscount") {
      filteredList = filteredList.sort((a, b) => b.discountPercentage - a.discountPercentage);
    }

    // Update pagination count after filtering
    setPagination({
      ...pagination,
      count: filteredList.length,
    });

    // Apply pagination to filtered list
    const start = (pagination.page - 1) * pageSize;
    const end = start + pageSize;
    setProductList(filteredList.slice(start, end));
  };

  // Handle pagination change
  const handlePagination = (event, page) => {
    setPagination({ ...pagination, page });
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setProductList(productList.slice(start, end));
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={2}>
          <div className="filters">
            <Grid container direction="column">
              <Grid item>
                <Button variant="contained" onClick={() => setProductList(originalData)}>
                  Clear filters
                </Button>
              </Grid>
              <Grid item>
                <SearchComponent onChange={handleSearch} searchValue={searchValue} />
              </Grid>
              <Grid item>
                <CategoryComponent onChange={handleCatChange} categoryValue={category} />
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={10}>
          <div className="products">
            <Grid container gap={2}>
              {productList.length !== 0 ? (
                productList.map((product) => (
                  <Grid item key={product._id}>
                    <ProductCard product={product} />
                  </Grid>
                ))
              ) : (
                <Grid container direction="column" alignContent="center">
                  <img src={not_found_pic} />
                </Grid>
              )}
            </Grid>
          </div>
        </Grid>
      </Grid>

      <Grid container justifyContent="center">
        <Grid item xs>
          <Pagination
            count={Math.ceil(pagination.count / pageSize)}
            page={pagination.page}
            color="primary"
            onChange={handlePagination}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default HomePage;
