import * as express from 'express';
import * as path from 'path';
import accountController from '../../controller/accountController/accountController';
import { UserData } from '../../model/account/accountInterface';

const router = express.Router();

// Get user info
router.get('/:username', (req, res) => {
    accountController.get(req.params.username)
    .then(result => {
        res.json({
            success: true,
            result
        });
    })
    .catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});

// Get all users
router.get('/', (req, res) => {
    accountController.getAll()
    .then(result => {
        res.json({
            success: true,
            data: result
        });
    })
    .catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});

// Get user avatar
router.get('/:username/avatar', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.resolve(__dirname, '../../../assets/users/' + req.params.username + '/avatar.png'));
});

// Update User Info
router.put('/', (req, res, next) => {
    accountController.updateUserInfo(req.cookies.token, req.body)
    .then(result => {
        res.json({
            success: true,
            user: result
        });
    })
    .catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});

// Change password
router.put('/password', (req, res, next) => {
    accountController.changePassword(req.cookies.token, req.body)
    .then(() => {
        res.json({
            success: true
        });
    })
    .catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});

// Update avatar
router.put('/avatar', (req, res, next) => {
    if (!req.cookies.token) {
        res.status(400).json({
            success: false,
            error: 'Not logged in'
        });

        return;
    }

    accountController.updateAvatar(req, res, req.cookies.token)
    .then(() => {
        res.json({
            success: true
        });
    })
    .catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});

export default router;