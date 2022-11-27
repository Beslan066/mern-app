import { body } from "express-validator";


export const loginValidation = [
    body('email','Неправильный формат email').isEmail(),
    body('password', 'Пароль должен состоять минимум из 6 символов').isLength({min: 6}),
];

export const registerValidation = [
    body('fullName', 'Имя и фамилия должны иметь минимум 3 символа').isLength({min: 3}),
    body('email','Неправильный формат email').isEmail(),
    body('password', 'Пароль должен состоять минимум из 6 символов').isLength({min: 6}),
    body('avatarUrl', 'Неверный формат ссылки').optional().isURL(),

];

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
    body('tags', 'Неверный формат тэгов').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];