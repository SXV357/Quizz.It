export function validateEmailFormat(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
}

export function validateEmailExistence(email) {
    // checks whether the passed in email is an actually valid one
    
}