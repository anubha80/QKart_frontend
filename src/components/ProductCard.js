import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";



const ProductCard = ({ product, handleAddToCart }) => {
  let loginToken = localStorage.getItem('token');


  return (
  <Card className="card">
        <CardMedia component="img" image={product.image} alt={product.name}/>
        <CardContent>
            <Typography style={{ fontSize: 16 }}  gutterBottom variant="h5" component="div">
                {product.name}
            </Typography>        
            <Typography style={{ fontWeight: 700 }} variant="h6">
                  ${product.cost}
            </Typography>
            <Rating name="read-only" value={product.rating} readOnly />               
          </CardContent> 
          <CardActions  className="card-actions card-button">
              <Button onClick={handleAddToCart} variant="contained" className="button" startIcon={<AddShoppingCartOutlined />}>
                ADD TO CART
              </Button>
          </CardActions>
    </Card>
  );
};

export default ProductCard;
