function isValidTitle(value: string) {
    return value && value.trim().length > 0 && value.trim().length <= 30;
}

function isValidAmount(value: string) {
    const amount = parseFloat(value);
    return !isNaN(amount) && amount > 0;
}

function isValidDate(value: string) {
    return value && new Date(value).getTime() < new Date().getTime();
}


type InputType = {
    title: string,
    amount: string
    date: string
}

type ValidationErrors = {
    title?: string;
    amount?: string;
    date?: string;
};
export function validateExpenseInput(input: InputType) {
    const validationErrors: ValidationErrors = {};

    if (!isValidTitle(input.title)) {
        validationErrors.title = 'Title must be 30 characters or less'
    }

    if (!isValidAmount(input.amount)) {
        validationErrors.amount = 'Must be a number greater than zero'
    }

    if (!isValidDate(input.date)) {
        validationErrors.date = 'Must be a date before today'
    }

    if (Object.keys(validationErrors).length > 0) {
        throw validationErrors;
    }
}


//user server validation

type UserInputType = {
    email: string,
    password: string
}

type UserValidationErrors = {
    email?: string,
    password?: string;
};

function isValidEmail(value: string) {
    return value && value.includes('@');
}

function isValidPassword(value: string) {
    return value && value.trim().length >= 7;
}

export function validateCredentials(input: UserInputType) {
    const validationErrors: UserValidationErrors = {};

    if (!isValidEmail(input.email)) {
        validationErrors.email = 'Invalid email address.'
    }

    if (!isValidPassword(input.password)) {
        validationErrors.password = 'Invalid password. Must be at least 7 characters long.'
    }

    if (Object.keys(validationErrors).length > 0) {
        throw validationErrors;
    }
}