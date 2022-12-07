import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, {
  useEffect,
  useState,
  componentDidMount,
  useSyncExternalStore,
} from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart, { generateCartItemsFrom } from "./Cart";

const Products = () => {
  // state variables
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [timer, setTimer] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState("");
  const [cartItemList, setCartItemList] = useState([]);
  const token = localStorage.getItem("token");

  // console.log(productList);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    performAPICall();
  }, []);


  useEffect(()=>{
    // console.log("-- inside useEffect() 2");
    // clear old timeout
    clearTimeout(timer);
    // add new timeout
    const newTimer = setTimeout(()=>{
    //   console.log("I am from new Timer");
      // debounceSearch(performSearch(searchKey),timer);
      performSearch(searchKey);
    }, 500);
    // store new timeout 
    setTimer(newTimer);

    // component will unmount
    return function(){
      clearTimeout(timer);
    }

  },[searchKey])

  //this useEffect is used as we are not sure which promise is resolved first
  // This takes a dependency array as input,
  useEffect(() => {
    console.log("I am called");
    fetchCart(token)
      .then((cardData) => {
        console.log("response of cart", cardData);
        return generateCartItemsFrom(cardData, productList);
      })
      .then((cartItems) => {
        console.log("Fixed response of cart", cartItems);
        setCartItemList(cartItems);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productList]);

  const performAPICall = async () => {
    setIsLoading(true);
    await axios
      .get(`${config.endpoint}/products`)
      .then((response) => {
        console.log(response.data);
        setIsLoading(false);
        setProductList(response.data);
        // setting loading icon false
        return response.data;
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        return null;
      });
  };

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
  };

  const performSearch = async (text) => {
    if (text !== "") {
      await axios
        .get(`${config.endpoint}/products/search?value=${text}`)
        .then((response) => {
          console.log(response.data);
          setProductList(response.data);
          // setting loading icon false
          setIsLoading(false);
        })
        .catch((error) => {
          setProductList([]);
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
        });
    }
  };

  /**
   * @typedef {Object} CartItem -  - Data on product added to cart
   *
   * @property {string} name - The name or title of the product in cart
   * @property {string} qty - The quantity of product added to cart
   * @property {string} category - The category that the product belongs to
   * @property {number} cost - The price to buy the product
   * @property {number} rating - The aggregate rating of the product (integer out of five)
   * @property {string} image - Contains URL for the product image
   * @property {string} productId - Unique ID for the product
   */

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      const url = `${config.endpoint}/cart`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      return null;
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    console.log("--- I am debounceSearch()");
    setSearchKey(event.target.value);

    // clear old timeout
    console.log("--- debounceTimeout : ", debounceTimeout);
    if (timer) clearTimeout(timer);
    // add new timeout
    const newTimer = setTimeout(() => {
      console.log("I am from new Timer");
      // debounceSearch(performSearch(searchKey),timer);
      console.log("--- searchKey value indebounceSearch() : ", searchKey);

      performSearch(searchKey);
    }, 500);
    // store new timeout
    setTimer(newTimer);
  };
  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */


  const isItemInCart = (items, productId) => {
    if (!items) {
      return false;
    }
    return items.findIndex((item) => item.productId === productId) !== -1;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */

  

  const addToCart = async (
    token,
    items,
    productId,
    products,
    qty,
    check = { preventDuplicate: false }
  ) => {
    console.log("token", items);
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }
    if (check.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in Cart.Use the cart sidebar to update quantity or remove item",
        { variant: "warning" }
      );
      return;
    }

    try {
      const url = `${config.endpoint}/cart`;
      const response = await axios.post(
        url,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cartItems = generateCartItemsFrom(response.data, products);
      setCartItemList(cartItems);
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON",
          { variant: "error" }
        );
      }
    }
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e, debounceTimeout)}
      />

      <Grid container>
        {/* check if the user is logged in 
				 if loggedin then take up 9/12 of the space leave the rest for cart
				 else occupy the full space ==> md={token ? 9:12}*/}
        <Grid item className="product-grid" md={token ? 9 : 12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          {isLoading ? (
            <Box className="loading">
              <CircularProgress />
              <p>Loading Products</p>
            </Box>
          ) : (
            <Grid container marginY="1rem" paddingY="1rem" spacing={2}>
              {productList.length ? (
                productList.map((product) => (
                  <Grid item xs={6} md={3} key={product._id}>
                    <ProductCard
                      product={product}
                      //  {preventDuplicate:true} to distinguish from which addToCart it is called
                      handleAddToCart={async () => {
                        await addToCart(
                          token,
                          cartItemList,
                          product._id,
                          productList,
                          1,
                          { preventDuplicate: true }
                        );
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Box className="loading">
                  <SentimentDissatisfied color="action" />
                  <h4 style={{ color: "#636363" }}>No Products Found</h4>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
        {/* checking for the token of the logged in user 
				if logged in for small screen occupy the entire space and large screen only use 3/12 of the screen */}
        {token ? (
          <Grid item xs={12} md={3} bgcolor="#E9F5E1">
            <Cart
              products={productList}
              items={cartItemList}
              handleQuantity={addToCart}
            />
          </Grid>
        ) : null}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
