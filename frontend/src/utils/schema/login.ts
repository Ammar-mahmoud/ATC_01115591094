import {object , string} from 'yup';
export const LoginSchema = object({
    email: string().email('Invalid email').required('Email is required'),
    password: string().min(8, 'Password must be at least 8 characters').required('Password is required'),
})