const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post("/users",(req,res)=>{
    const response=req.body;
    let u;
    if(response.balance)
        u = new User({name:response.name, user_name: response.user_name, balance: response.balance});
    else
        u = new User({name:response.name, user_name: response.user_name, balance: 100});
    u.save((error, result) => {
        if (result)
            res.send(result);
        else
            res.send(error);
    });
});

router.get("/users",(req,res)=>{
    User.find({},(error,result)=>{
        if(result)
            res.send(result);
        else
            res.send(error);
    })
})

router.get("/users/:user_name",(req,res)=>{
    User.findOne({user_name:req.params.user_name},(error,result)=>{
        if(result)
            res.send(result);
        else
            res.send(error);
    })
})

router.delete("/users/:user_name",(req,res)=>{
    User.deleteOne({user_name:req.params.user_name},(error,result)=>{
        if(result) {
            if(result.deletedCount === 0)
                res.send("User not found");
            else
                res.send("Deleted Successfully");
        }else
            res.send("Error accessing DB");
    })
})

router.post("/products",(req,res)=>{
    User.findOne({user_name:req.body.owner},(error,result)=>{
        if(result) {
            result.items.push({name:req.body.name,price:req.body.price});
            result.save((error,result)=>{
                if(result)
                    res.send(result);
                else
                    res.send(error);
            })
        }else{
            res.send("Seller not found");
        }
    })
})

router.get("/products",(req,res)=>{
    User.find({},(error,users)=>{
        if(users){
            let products = [];
            for(let user of users)
                for(let item of user.items)
                    products.push(item);
            res.send(products);
        }
        else
            res.send(error);
    })
})

router.post("/products/buy",(req,res)=>{
    let productID=req.body.productID;
    let buyerUsername=req.body.buyer;
    let seller;
    User.findOne({user_name:buyerUsername},(error,result)=>{
        if(result){
            const buyer=result;
            User.findOne({items:{$elemMatch:{_id:productID}}},(error,user)=>{
                if(user){
                    let item=user.items.find(item=>item._id.toString()===productID);
                    const itemCopy = {
                        name: item.name,
                        price: item.price
                    };
                    seller=user;
                    if(seller.user_name===buyer.user_name)
                        return res.send({msg:'Oops, '+buyer.name+' already owns this product'});
                    else if(buyer.balance<item.price)
                        return res.send({msg:'Oops, '+buyer.name+' has insufficient funds'});
                    else{
                        seller.balance+=item.price;
                        buyer.balance-=item.price;
                        seller.items.pull(item);
                        buyer.items.push(itemCopy);
                        seller.save();
                        buyer.save();
                        return res.send({msg:'Transaction Successful'});
                    }
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