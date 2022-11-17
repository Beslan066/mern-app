import  express  from "express";
import  jwt  from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import {registerValidation} from './validations/register.js';

import User from "./models/User.js";

mongoose
    .connect('mongodb+srv://admin:Jdsd17vsq@cluster0.srjdy0d.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB connection true'))
    .catch((err) => console.log('DB connection false', err));


const app = express();

app.use(express.json());


app.post('/auth/login', async (req,res) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if(!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        
        
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass) {
            return res.status(404).json({
                message: "Неверный логин или пароль",
            });
        }

        const token = jwt.sign({
            _id: user._id,
        },
            'secret123',

        {
            expiresIn: '30d',
        }    
        );

        const {passwordHash, ...userData} = user._doc;
        

        res.json({
            ...userData,
            token,

        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось авторизоваться"
        })
    }
});

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty ()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);


        const doc = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
        });

        const user = await doc.save();


        

        const token = jwt.sign({
            _id: user._id,
        },
            'secret123',

        {
            expiresIn: '30d',
        }    
        );

        const {passwordHash, ...userData} = user._doc;
        

        res.json({
            ...userData,
            token,

        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось зарегистрироваться"
        })
    }
});




app.listen(4444, (err) => {
    if(err) {
        console.log(err);
    }else {
        console.log("Server Ok");
    }
})