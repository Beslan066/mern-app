import  express  from "express";
import mongoose from "mongoose";
import multer from "multer";


import {registerValidation, loginValidation, postCreateValidation} from './validations.js';
import checkAuth from './utils/checkAuth.js';

import {UserController, PostController} from './controllers/index.js'

mongoose
    .connect('mongodb+srv://admin:Jdsd17vsq@cluster0.srjdy0d.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB connection true'))
    .catch((err) => console.log('DB connection false', err));


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'))

app.post('/auth/login',loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/lk', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', PostController.update);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.listen(4444, (err) => {
    if(err) {
        console.log(err);
    }else {
        console.log("Server Ok");
    }
})