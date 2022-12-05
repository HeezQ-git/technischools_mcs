import { useState } from "react";
// import _debounce from "lodash/debounce";

export const useForm = (initialValues) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const checkValidation = (validation) => {
        const errors = Object.entries(validation).reduce((acc, [key, validator]) => {
            const { pattern, message } = validator(values[key]);
            if (!pattern) {
                acc[key] = message;
            }
            return acc;
        }, {});
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const clearErrors = () => setErrors({});

    return {
        values,
        setValues,
        handleChange: (e) => {
            e.persist();
            handleChange(e);
        },
        checkValidation,
        errors,
        clearErrors,
    };
};

// const validationValues = {
//     name: () => ({
//         pattern: (value) => value.length > 0,
//         message: "Name is required",
//     }),
//     email: () => ({
//         pattern: (value) => value.length > 0 && value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
//         message: "Email is required",
//     }),
//     password: () => ({
//         pattern: (value) => value.length > 0,
//         message: "Password is required",
//     }),
//    phone_number: () => ({
    //     pattern: (value) => value.length > 0 && value.match(/^[0-9]{9}$/),
    //     message: "Phone number is required",
    // }),
// };

