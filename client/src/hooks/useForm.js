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

    const addError = (name, message) => {
        setErrors((prev) => ({ ...prev, [name]: message }));
    };

    const removeError = (name) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
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
        removeError,
        addError,
    };
};

