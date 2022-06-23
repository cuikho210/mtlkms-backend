import * as express from 'express';
import diaryController from '../../controller/studyDiaryController/diaryController';

const router = express.Router();

// Get all diaries
router.get('/all', (req, res) => {
    let limit = parseInt(req.query.limit) || 10;

    diaryController.getAll(limit).then(result => {
        res.json({
            success: true,
            data: result
        });
    }).catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});

// Start learning diary
router.post('/', (req, res) => {
    diaryController.create(req.cookies.token, req.body).then(result => {
        res.json({
            success: true,
            data: result
        });
    }).catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});

// Stop learning diary
router.put('/', (req, res) => {
    diaryController.stopLearningDiary(req.cookies.token, req.body).then(result => {
        res.json({
            success: true,
            data: result
        });
    }).catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});

// Get learning diary
router.get('/:user', (req, res) => {
    diaryController.getLearningDiary(req.params.user).then(result => {
        res.json({
            success: true,
            data: result
        });
    }).catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});

// Get diaries by SDTag
router.get('/:user/:year/:month/:sdtag', (req, res) => {
    diaryController.getDiariesBySDTag(
        req.params.sdtag,
        req.params.user,
        req.params.month,
        req.params.year
    ).then(result => {
        res.json({
            success: true,
            data: result
        });
    }).catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});

// Get diaries by user
router.get('/:user/:year/:month', (req, res) => {
    diaryController.getDiariesByUser(
        req.params.user,
        req.params.month,
        req.params.year
    ).then(result => {
        res.json({
            success: true,
            data: result
        });
    }
    ).catch(err => {
        res.status(400).json({
            success: false,
            error: err.message
        });
    });
});

export default router;