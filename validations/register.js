import { body } from "express-validator";

export const registerValidation = [
    body('fullName', 'Имя и фамилия должны иметь минимум 3 символа').isLength({min: 3}),
    body('email','Неправильный формат email').isEmail(),
    body('password', 'Пароль должен состоять минимум из 6 символов').isLength({min: 6}),
    body('avatarUrl', 'Неверный формат ссылки').optional().isURL(),

];