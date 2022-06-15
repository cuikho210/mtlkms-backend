class Validator {
    constructor () {

    }

    public htmlEncode (str: string) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    public isValidEmail (email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    public isValidPassword (password: string) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
    }

    public isValidUsername (username: string) {
        return /^[a-zA-Z0-9]{3,20}$/.test(username);
    }

    public isValidName (name: string) {
        return /^.{3,50}$/.test(name);
    }
}

export default new Validator();