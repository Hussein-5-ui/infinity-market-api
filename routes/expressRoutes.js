const express = require('express');
const router = express.Router();
//import the User model
const User = require('../models/User');
//route to create a new user and save it to the database
router.post("/users",(req,res)=>{
    const response=req.body; //get the response from the request body
    let u;
    //two statements to check if the user has a balance or not so that we can set the default balance to 100
    if(response.balance)
        u = new User({name:response.name, user_name: response.user_name, balance: response.balance});
    else
        u = new User({name:response.name, user_name: response.user_name, balance: 100});
    //save the user to the database
    u.save((error, result) => {
        if (result)
            res.send(result);
        else
            res.send(error);
    });
});
//route to get all the users from the database
router.get("/users",(req,res)=>{
    //find all the users in the database
    User.find({},(error,result)=>{
        if(result)
            res.send(result);//send the result to the client
        else
            res.send(error);//send the error to the client
    })
})
//route to get the user with the given username from the database
router.get("/users/:user_name",(req,res)=>{
    //find the first user with the given username
    User.findOne({user_name:req.params.user_name},(error,result)=>{
        if(result)
            res.send(result);
        else
            res.send(error);
    })
})
//route to delete the user with the given username
router.delete("/users/:user_name",(req,res)=>{
    //delete the first user with the given username
    User.deleteOne({user_name:req.params.user_name},(error,result)=>{
        if(result) {
            //check if the user was deleted successfully
            if(result.deletedCount === 0)
                res.send("User not found");
            else
                res.send("Deleted Successfully");
        }else
            res.send("Error accessing DB");
    })
})
//route to create a new product and save it to the database
router.post("/products",(req,res)=>{
    //find the first user with the given username
    User.findOne({user_name:req.body.owner},(error,result)=>{
        if(result) {
            //add the product to the user's items array
            result.items.push({name:req.body.name,price:req.body.price});
            result.save((error,result)=>{
                //send the result to the client
                if(result)
                    res.send(result);
                else
                    res.send(error);
            })
        }else{
            //if the user is not found, send an error message
            res.send("Seller not found");
        }
    })
})
//rout to get all the products from the database
router.get("/products",(req,res)=>{
    User.find({},(error,users)=>{
        if(users){
            let products = [];
            //nested for loop to get all the products and push them to the products array
            for(let user of users)
                for(let item of user.items)
                    products.push(item);
            //send the products array to the client
            res.send(products);
        }
        else
            res.send(error);
    })
})
//route to buy a product
router.post("/products/buy",(req,res)=>{
    //get the productID and buyerUsername from the request body
    let productID=req.body.productID;
    let buyerUsername=req.body.buyer;
    let seller;
    //find the first user with the given username
    User.findOne({user_name:buyerUsername},(error,result)=>{
        if(result){
            //if the user is found, assign the user to the buyer variable
            const buyer=result;
            //find the first user with the given productID
            User.findOne({items:{$elemMatch:{_id:productID}}},(error,user)=>{
                if(user){
                    let item=user.items.find(item=>item._id.toString()===productID);
                    //make a copy of the item to avoid potentially losing it when we remove it from the user's items array'
                    const itemCopy = {
                        name: item.name,
                        price: item.price
                    };
                    seller=user;
                    //check if the buyer owns the product or if the buyer doesn't have sufficient funds to buy the product
                    if(seller.user_name===buyer.user_name)
                        return res.send({msg:'Oops, '+buyer.name+' already owns this product'});
                    else if(buyer.balance<item.price)
                        return res.send({msg:'Oops, '+buyer.name+' has insufficient funds'});
                    else{
                        //main transaction logic
                        //updates the users' balances and items array
                        seller.balance+=item.price;
                        buyer.balance-=item.price;
                        seller.items.pull(item);
                        buyer.items.push(itemCopy);
                        seller.save();
                        buyer.save();
                        return res.send({msg:'Transaction Successful'});
                    }
                }
                else{
                    //checks if the product is not found even though we're supposed to assume the product_id is valid as an extra precaution
                    return res.send({msg:'Product not found'});
                }
            })
        }
    })
    router.delete("/products/:id",(req,res)=>{
        User.deleteOne({items:{$elemMatch:{_id:req.params.id}}},(error,result)=>{
            if(result) {
                if(result.deletedCount === 0)
                    res.send("Product not found");
                else
                    res.send(result);
            }else
                res.send("Error accessing DB");
        })
    })
})

module.exports = router;