const router = require('express').Router();
const User = require('../models/User');

const {verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin} = require('../middlewares/verify');

router.put("/:id", verifyTokenAndAuth, async(req, res) => {

    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true
            }
        );
        res.status(201).json(updatedUser);
    } catch(error){
        res.status(500).json(error);
    }
});

router.delete("/:id", verifyTokenAndAuth, async(req, res) => {

    try{
        const updatedUser = await User.findByIdAndDelete(
            req.params.id,
        );
        res.status(201).json("Account deleted Successfully!!!");
    } catch(error){
        res.status(500).json(error);
    }
});

// Admin Part

router.get("/find/:id", verifyTokenAndAdmin, async(req, res) => {

    try{
        const user = await User.findById(
            req.params.id,
        );
        const {password, ...others} = user._doc;
        res.status(201).json(others);
    } catch(error){
        res.status(500).json(error);
    }
});

router.get("/", verifyTokenAndAdmin, async(req, res) => {
    const query = req.query.new;
    try{
        const users = query ? await User.find().sort({_id: -1}).limits(2) : await User.find();
        res.status(201).json(users);
    } catch(error){
        res.status(500).json(error);
    }
});

// get user stats
router.get("/stats", verifyTokenAndAdmin, async(req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try{
        const data = await User.aggregate([
            {$match: {createdAt: {$get: lastYear}}},
            {
                $project: {
                    month: {$month: "$createdAt"},
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1},
                },
            },
        ]);
        res.status(201).json(data);
    } catch(error){
        res.status(500).json(error);
    }
});

module.exports = router;