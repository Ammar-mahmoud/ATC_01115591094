import {object , string , ref} from 'yup';
export const SignupSchema = object({
    name : string().min(10, 'Name must be at least 2 characters').required('Name is required'),
    gender: string().oneOf(['Male', 'Female'], 'Gender must be one of: Male or Female').required('Gender is required'),
    email: string().email('Invalid email').required('Email is required'),
    password: string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    passwordConfirm: string().oneOf([ref('password')], 'Passwords must match').required('Confirm Password is required'),
})