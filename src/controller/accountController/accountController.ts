import * as md5 from 'md5';
import * as fs from 'fs';
import * as multer from 'multer';
import account from "../../model/account/account";
import validator from "../../model/validator";
import { salt } from "../../pwd";
import { UserData, DbResult, ChangePasswordData } from "../../model/account/accountInterface";

class AccountController {
    constructor () {

    }

    private genToken (username: string, id: number) : string {
        return username + '__'  + md5(id + salt);
    }

    private hashPassword (password: string) : string {
        return md5(password + salt);
    }

    private matchPassword (password: string, hash: string) : boolean {
        let hashedPassword: string = this.hashPassword(password);
        return hashedPassword === hash;
    }

    private getUsernameFromToken (token: string) : string {
        if (!token) {
            throw new Error("Invalid token");
        }

        let username = token.split('__')[0];
        return username;
    }

    private matchToken (token: string, userData: UserData) : boolean {
        let userToken = this.genToken(userData.username, userData.id);
        return token === userToken;
    }

    public async getUserDataFromToken (token: string) : Promise<UserData> {
        let username: string = this.getUsernameFromToken(token);

        let userData: UserData = await account.get(username);

        if (!userData) {
            throw new Error("Invalid token");
        }

        if (!this.matchToken(token, userData)) {
            throw new Error("Invalid token");
        }

        return userData;
    }

    private createAvatar (username: string) : boolean {
        // Check if user directory exists
        let userDir = './assets/users/' + username;

        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir);
        }
        
        // Check if avatar exists
        let avatarPath = userDir + '/avatar.png';
        if (fs.existsSync(avatarPath)) {
            return false;
        }
        
        // Copy avatar
        let avatar = './assets/avatar.png';
        fs.copyFileSync(avatar, avatarPath);

        return true;
    }

    public async get (username: string) : Promise<UserData> {
        if (!validator.isValidUsername(username)) {
            throw new Error("Invalid username");
        }

        let userData: UserData = await account.get(username);

        if (!userData) {
            throw new Error("Username not found");
        }

        return {
            name: userData.name,
            username: userData.username,
            email: userData.email,
            id: userData.id,
            slogan: userData.slogan,
            created_at: userData.created_at,
            password: '',
            forget_pwd: ''
        };
    }

    public async getAll () {
        return await account.getAll()
        .then(result => {
            return result;
        })
        .catch(err => {
            throw err;
        });
    }

    public async create (data: UserData) {
        if (!data.name || !data.username || !data.password || !data.email) {
            throw new Error("Invalid data");
        }
        else if (!validator.isValidName(data.name)) {
            throw new Error("Invalid name");
        }
        else if (!validator.isValidEmail(data.email)) {
            throw new Error("Invalid email");
        }
        else if (!validator.isValidUsername(data.username)) {
            throw new Error("Invalid username");
        }
        else if (!validator.isValidPassword(data.password)) {
            throw new Error("Invalid password");
        }
        
        let name: string = data.name;
        let email: string = data.email;
        let username: string = data.username;
        
        // Hash the password
        let password: string = this.hashPassword(data.password);

        // Create avatar
        let isAvatarCreated = this.createAvatar(username);

        if (!isAvatarCreated) {
            console.log("Avatar already exists");
        }
        
        // Create user
        let result = await account.create([name, email, username, password])
        .then(() => {
            return false;
        })
        .catch(err => {
            throw err;
        });

        if (result) {
            throw result;
        }

        // Get user data
        let userData: UserData = await account.get(username);

        // Create token
        let token: string = this.genToken(username, userData.id);

        return {
            token: token,
            user: {
                id: userData.id,
                name: userData.name,
                username: userData.username,
                email: userData.email,
                slogan: userData.slogan,
                created_at: userData.created_at
            }
        };
    }

    public async login (data: UserData) {
        if (!data.username || !data.password) {
            throw new Error("Invalid data");
        }

        let password: string = this.hashPassword(data.password);

        // Login
        let isLogin = await account.login([data.username, password])
        .then((result: UserData) => {
            if (!result) {
                throw new Error("Username not found or password is incorrect");
            }
            else {
                return false;
            }
        })
        .catch(err => {
            throw err;
        });

        // Get user data
        if (isLogin) {
            throw isLogin;
        }
        else {
            let userData: UserData = await account.get(data.username);

            // Create token
            let token: string = this.genToken(data.username, userData.id);

            return {
                token: token,
                user: {
                    id: userData.id,
                    name: userData.name,
                    username: userData.username,
                    email: userData.email,
                    slogan: userData.slogan,
                    created_at: userData.created_at
                }
            };
        }
    }

    public async checkLogin (token: string) {
        let userData: UserData = await this.getUserDataFromToken(token);

        return {
            id: userData.id,
            name: userData.name,
            username: userData.username,
            email: userData.email,
            slogan: userData.slogan,
            created_at: userData.created_at
        };
    }

    public async updateUserInfo (token: string, data: UserData) {
        if (!data.name || !data.slogan) {
            throw new Error("Invalid data");
        }
        else if (!validator.isValidName(data.name)) {
            throw new Error("Invalid name");
        }

        let name: string = data.name;
        let slogan: string = data.slogan;

        let userData: UserData = await this.getUserDataFromToken(token);

        let result: DbResult = await account.updateUserInfo([name, slogan, String(userData.id)]);

        if (!result || result.affectedRows == 0) {
            throw new Error("Update failed");
        }

        return {
            id: userData.id,
            name: name,
            username: userData.username,
            email: userData.email,
            slogan: slogan,
            created_at: userData.created_at
        }
    }

    public async changePassword (token: string, data: ChangePasswordData) {
        if (!data.oldPassword || !data.newPassword) {
            throw new Error("Invalid data");
        }

        if (!validator.isValidPassword(data.newPassword)) {
            throw new Error("Invalid password");
        }
        
        let userData: UserData = await this.getUserDataFromToken(token);

        if (!this.matchPassword(data.oldPassword, userData.password)) {
            throw new Error("Old password is incorrect");
        }

        let newPassword: string = this.hashPassword(data.newPassword);

        let result: DbResult = await account.changePassword([newPassword, String(userData.id)]);

        if (!result || result.affectedRows == 0) {
            throw new Error("Update failed");
        }

        return true;
    }

    public async updateAvatar (req, res, token: string) {
        let userData: UserData = await this.getUserDataFromToken(token);

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "./assets/users/" + userData.username);
            },
            filename: function (req, file, cb) {
                cb(null, "avatar.png");
            }
        });

        const upload = multer({ storage: storage }).single('avatar');

        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if(err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            });
        });

        return true;
    }
}

export default new AccountController();