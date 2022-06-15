import * as express from 'express';
import accountController from '../../controller/accountController/accountController';

const router = express.Router();

const cookieConfig = {
    httpOnly: false,
    secure: true,
    sameSite: 'None',
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
};

// Create a new account
router.post('/register', (req, res, next) => {
    accountController.create(req.body)
    .then(data => {
        res.cookie('token', data.token, cookieConfig).json({
            success: true,
            user: data.user
        });
    })
    .catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});

// Login
router.post('/login', (req, res, next) => {
    accountController.login(req.body)
    .then(data => {
        res.cookie('token', data.token, cookieConfig).json({
            success: true,
            user: data.user
        });
    })
    .catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});

// Check Login
router.get('/check-login', (req, res, next) => {
    if (!req.cookies.token) {
        res.status(400).json({
            success: false,
            error: 'Not logged in yet'
        })
    }
    else {
        accountController.checkLogin(req.cookies.token)
        .then(data => {
            res.json({
                success: true,
                user: data
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                error: err.message
            });
        });
    }
});

router.get('/logout', (req, res, next) => {
    res.clearCookie('token', {
        httpOnly: false,
        secure: true,
        sameSite: 'None'
    })
    .json({
        success: true
    });
});

export default router;