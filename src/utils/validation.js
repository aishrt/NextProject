import { isValidPhoneNumber } from 'react-phone-number-input';

export const isValidMobile = (phonenumber) => {
    if (!phonenumber) return false;
    return isValidPhoneNumber(phonenumber.toString());
};

export const isValidMobileMsg = (phonenumber) => {
    if (!phonenumber) return { message: 'Phone number is required' };
    if (!isValidPhoneNumber(phonenumber.toString())) return { message: 'Phone number is not valid!' };
    return { message: '' };
};