import passport from 'passport';
import {Context, RouterFactory} from '../interfaces/general';
import express from 'express';
import {check} from 'express-validator';
import { roles } from '../middleware/role';
import { User, UserRole } from '../models/user.model';
import { validationResult} from 'express-validator';
import { UserService } from '../services/user.service';

export const makeUserRouter = (context: Context)=>{
    const router = express.Router();
    const userservice = new UserService();

    router.post('/users',  [
        check('email', "email shouldn't be empty").notEmpty(),
        check('email', "not correct email").isEmail(),
        check('password', "Password should be length of >4 and <10").isLength({min: 4, max:10}),
        check('firstName', "The field with firstName should not be empty").notEmpty(),
        check('lastName', "The field with firstName should not be empty").notEmpty(),
    ], passport.authenticate('jwt', {session: false}), roles([UserRole.Admin]), async(req:any,res:any)=>{
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({message: 'Validation error', errors});
            }
            const user = await userservice.addUser(req,res);

            res.status(201).json(user);

        } catch(err){
            console.error("Error on the path POST /api/users: ", err);
            return res.status(505).json({message: 'Something went wrong on the server'});
        }
    });

    router.get('/users',passport.authenticate('jwt', {session: false}), roles([UserRole.Admin]), async(req,res)=>{
        await userservice.getUsers(req,res);
    });

    router.get('/users/:id',passport.authenticate('jwt', {session: false}), async(req,res)=>{
        try {
            const id = parseInt(req.params.id as string);

            const user = await User.findByPk(id);

            if(!user){
                return res.status(404).json("Not found with this id");
            }

            return res.status(200).json(user);

        } catch (error) {
            console.error("Error with fetching user with id: ", error);
            return res.status(505).json({message: "Something went wrong on the server"});
        }
    });

    return router;
}