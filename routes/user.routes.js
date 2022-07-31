import { User } from "../models/User.js";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { isAuth } from "../authentication/jwt.js";


const userRoutes = express.Router();



//get all users
userRoutes.get('/', [isAuth], async (req, res) => {

    const { email } = req.authority
    console.log(email) 
    try {
        //   if (email === "dosorioadmin@gmail.com") {

        const user = await User.find()
        return res.status(200).json(user)

        //   } else {
        //     res.send("You don't have any ADMIN privileges");
        //   }
    } catch (error) {
        return next(error)
    }
});


//Register user
userRoutes.post('/', async (req, res, next) => {

    try {
        const { body } = req

        const previousUser = await User.findOne({ email: body.email })

        if (previousUser) {
            const error = new Error('The user is already in use')
            return next(error)
        }

        const pwdCryped = await bcrypt.hash(body.password, 10)

        const newUser = new User({
            email: body.email,
            password: pwdCryped
        })

        const savedUser = await newUser.save()

        return res.json({
            status: 201,
            message: 'Registered successfully',
            data: { id: savedUser._id }
        });

    } catch (error) {
        return next(error)
    }

})


//login user
userRoutes.post('/login', async (req, res, next) => {
    try {

        const { body } = req

        const user = await User.findOne({ email: body.email });
        const validPassword = await bcrypt.compare(body.password, user?.password ?? '');

        if (!user || !validPassword) {
            const error = {
                status: 401,
                message: 'the email and password combination are incorrect'
            };
            return next(error);
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            req.app.get("secretKey"),
            { expiresIn: "1h" }
        );

        return res.json({
            status: 200,
            message: 'Login successfully',
            data: { id: user._id, token: token }
        });


    } catch (error) {
        return next(error)
    }
})

//logOut
userRoutes.post('/logout', async (req, res, next) => {
    try {
        req.authority = null;
        return res.json({
            status: 200,
            message: 'logged out',
            token: null
        })
    } catch (error) {
        next(error)
    }
});

export { userRoutes }