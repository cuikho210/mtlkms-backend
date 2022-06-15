import * as express from 'express';
import * as cookieParser from 'cookie-parser';

import routes from './router/routes';
import userRoutes from './router/account/userRoutes';
import accountRoutes from './router/account/accountRoutes';
import SDTagRoutes from './router/studyDiary/SDTagRoutes';
import diaryRoutes from './router/studyDiary/diaryRoutes';

const PORT: number = 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use('/', routes);
app.use('/', accountRoutes);
app.use('/user', userRoutes);
app.use('/study-diary', SDTagRoutes);
app.use('/study-diary/diary', diaryRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;