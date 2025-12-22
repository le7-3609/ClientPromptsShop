
export class LoginModel{
    email: string='';
    password: string='';

    constructor(data?: Partial<LoginModel>) {
        Object.assign(this, data);
    }
}