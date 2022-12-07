import {
    AddOutlined,
    RemoveOutlined,
    ShoppingCart,
    ShoppingCartOutlined,
  } from "@mui/icons-material";
  import { Button, IconButton, Stack,Typography} from "@mui/material";
  import { Box } from "@mui/system";
  import React, { useEffect, useState } from "react";
  import { isElement } from "react-dom/test-utils";
  import { Link, useHistory } from "react-router-dom";
  import "./Cart.css";
  
  // Definition of Data Structures used
  /**
   * @typedef {Object} Product - Data on product available to buy
   * 
   * @property {string} name - The name or title of the product
   * @property {string} category - The category that the product belongs to
   * @property {number} cost - The price to buy the product
   * @property {number} rating - The aggregate rating of the product (integer out of five)
   * @property {string} image - Contains URL for the product image
   * @property {string} _id - Unique ID for the product
   */
  
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
   * Returns the complete data on all products in cartData by searching in productsData
   *
   * @param { Array.<{ productId: String, qty: Number }> } cartData
   *    Array of objects with productId and quantity of products in cart
   * 
   * @param { Array.<Product> } productsData
   *    Array of objects with complete data on all available products
   *
   * @returns { Array.<CartItem> }
   *    Array of objects with complete data on products in cart
   *
   */
  
  

  export const generateCartItemsFrom = (cartData, productsData) => {
    if (!cartData) return;
  
    const newCart = cartData.map((item) => ({
      ...item,
      ...productsData.find((product) => product._id === item.productId),
    }));
    //console.log(newCart)
    return newCart;
  };
  
  /**
   * Get the total value of all products added to the cart
   *
   * @param { Array.<CartItem> } items
   *    Array of objects with complete data on products added to the cart
   *
   * @returns { Number }
   *    Value of all items in the cart
   *
   */
   export const getTotalCartValue = (items = []) => {
    //if there is no item in the cart
    if (!items.length) return 0;
  
    //For the items in the cart total it and return the final cost
    const total = items
      .map((item) => item.cost * item.qty)
      .reduce((total, n) => total + n);
  
    return total;
  };
  //  END of getTotalCartValue function
  

// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
 export const getTotalItems = (items = []) => {
  // return total item quantity
  let totalQuanity=0;
  for(let i=0;i<items.length;i++){
    totalQuanity=totalQuanity+(items[i].qty);
  }
  return totalQuanity;
};





// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */

  const ItemQuantity = ({
    value,
    handleAdd,
    handleDelete,
  }) => {
    // console.log(handleAdd);
    // console.log(handleDelete);
    if(handleAdd===undefined && handleDelete===undefined){
      return (
        <Box padding="0.5rem" fontWeight="700">
           Qty: {value}
        </Box>
      );
    }
    return (
      <Stack direction="row" alignItems="center">
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value}
        </Box>
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      </Stack>
    );
  };
  
 
/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */

  const Cart = ({
    products,
    items = [],
    handleQuantity,
    isReadOnly
  }) => {

    // console.log("--- isReadOnly ", isReadOnly);

    const token = localStorage.getItem("token");
    
    // return for empty cart 
    if (!items.length) {
      return (
        <Box className="cart empty">
          <ShoppingCartOutlined className="empty-cart-icon" />
          <Box color="#aaa" textAlign="center">
            Cart is empty. Add more items to the cart to checkout.
          </Box>
        </Box>
      );
    } 
  
    // return statement for cart having items
    return (
      <>
        <Box className="cart">
          {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
  
          {items.map((p,index)=>{
                    return (
                          <Box display="flex" alignItems="flex-start" padding="1rem" key={p._id}>
                            <Box className="image-container">
                                <img
                                    // Add product image
                                    src={p.image}
                                    // Add product name as alt eext
                                    alt={p.name}
                                    width="100%"
                                    height="100%"
                                />
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-between"
                                height="6rem"
                                paddingX="1rem"
                                fontSize={"1rem"}
                                >
                                <div>{p.name}</div>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    fontWeight="700"
                                >
                                  {/* <ItemQuantity value={p.qty} 
                                  handleAdd={async () => {
                                    await handleQuantity(
                                      token,
                                      items,
                                      p.productId,
                                      products,
                                      p.qty + 1
                                    );
                                  }}
                                  handleDelete={async () => {
                                    await handleQuantity(
                                      token,
                                      items,
                                      p.productId,
                                      products,
                                      p.qty - 1
                                    );
                                  }}
                                  // Add required props by checking implementation
                                  /> */}
                                  {isReadOnly ? <ItemQuantity value={p.qty}/> : 
                                  <ItemQuantity value={p.qty} 
                                  handleAdd={async () => {
                                    await handleQuantity(
                                      token,
                                      items,
                                      p.productId,
                                      products,
                                      p.qty + 1
                                    );
                                  }}
                                  handleDelete={async () => {
                                    await handleQuantity(
                                      token,
                                      items,
                                      p.productId,
                                      products,
                                      p.qty - 1
                                    );
                                  }}
                                  // Add required props by checking implementation
                                  />
                                  }
  
                                  <Box padding="0.5rem" fontWeight="700">
                                      ${p.cost}
                                  </Box>
                                </Box>
                            </Box>
                      </Box>
                    )
          })}
            
  
          {/* end of cart elements here */}
  
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="600"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              {/* ${getTotalCartValue(items)} */}
              ${getTotalCartValue(items)}
            </Box>
          </Box>
          
          {/*  Hide checkout button if called by Checkout COmponent */}
          {isReadOnly ? <></> :
              <Box display="flex" justifyContent="flex-end" className="cart-footer">
              <Link className="link" to="/checkout">
                <Button
                  color="primary"
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  className="checkout-btn"
                >
                Checkout
                  {/* Checkout */}
                </Button> </Link>
              </Box>
          }
          
        </Box>
        {isReadOnly && 
          <Box className="order-details" padding="0.5rem">
            <Typography color="#3C3C3C" variant="h6" fontWeight={600} ml="0.5rem" mt="1rem">
            Order Details
            </Typography>
            <Box display={"flex"} sx={{ flexDirection: 'column' }}>
              <Box display={"flex"} padding="0.5rem" flexDirection={"row"} justifyContent="space-between">
                <Box>Products</Box>
                <Box>{getTotalItems(items)}</Box>
              </Box>
              <Box display={"flex"} padding="0.5rem" flexDirection={"row"} justifyContent="space-between">
                <Box>Subtotal</Box>
                <Box>${getTotalCartValue(items)}</Box>
              </Box>
              <Box display={"flex"} padding="0.5rem" flexDirection={"row"} justifyContent="space-between" alignItems={"center"}>
                <Box>Shipping Charges</Box>
                <Box>$0</Box>
              </Box>
              <Box display={"flex"} padding="0.5rem" fontWeight={600} flexDirection={"row"} justifyContent="space-between">
                <Box>Total</Box>
                <Box>${getTotalCartValue(items)}</Box>
              </Box>
            </Box>
        </Box>
        }
        
      </>
    ); // end of return () of Cart Component 
  }; // end of Cart component 
  
  export default Cart;
  
