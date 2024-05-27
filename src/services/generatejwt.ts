import jwt from "jsonwebtoken";

export function generateToken(user: any){
    const secretKey = 'SECRET_KEY';
    const token = jwt.sign({id: user.id, email: user.email}, secretKey, {expiresIn: "12h"});
    return token;
}