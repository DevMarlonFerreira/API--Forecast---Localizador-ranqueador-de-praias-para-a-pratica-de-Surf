import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { Request, Response } from 'express';
import { BaseController } from '.';

@Controller('users')
export class UserstController extends BaseController {
    @Post('')
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const user = new User(req.body);
            const newUser = await user.save();
            res.status(201).send(newUser);
        }
        catch (error) {
            this.sendCreatedUpdateErrorResponse(res, error);
        }
    }

    @Post('authenticate')
    public async authenticate(req: Request, res: Response): Promise<Response> {
        // const { email, password } = req.body;
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return this.sendErrorResponse(res, {
                code: 401,
                message: 'User not found!'
            });
        }
        if (!(await AuthService.comparePasswords(req.body.password, user.password))) {
            return this.sendErrorResponse(res, {
                code: 401,
                message: 'Password does not match!'
            });
        }
        // const token = AuthService.generateToken(user.toJSON());
        // const token = AuthService.generateToken({ name: user.name, email: user.email });
        const token = AuthService.generateToken(user.toJSON());
        return res.status(200).send({ ...user.toJSON(), ...{ token } });
    }

    @Get('me')
    @Middleware(authMiddleware)
    public async me(req: Request, res: Response): Promise<Response> {
        const email = req.decoded ? req.decoded.email : undefined;
        const user = await User.findOne({ email });
        if (!user) {
            return this.sendErrorResponse(res, { code: 404, message: 'User not found!' });
        }

        return res.send({ user });
    }
}
