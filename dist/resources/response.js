export const response = (res, status, message, data) => {
    res.status(status).json({ success: status < 300, message, data });
};
export const message = {
    // MISSING_CREDENTIALS: 'User creation form missing mandatory credentials',
    MISSING_CREDENTIALS: 'MISSING_CREDENTIALS',
    // DOUBT which one should i use? The explicit text one or just the CODE_ONE
    UNAVAILABLE_CREDENTIALS: 'UNAVAILABLE_CREDENTIALS',
    // UNAVAILABLE_CREDENTIALS: 'User creation form has credentials already taken',
    INVALID_CREDENTIALS: 'User creation form has credentials with invalid syntax',
    JWT_NOT_FOUND: 'JWT is missing from request',
    JWT_MISSING_USERID: 'JWT is missing User ID',
    USER_NOT_FOUND: 'User not found',
    USER_CONFIRMED_OK: 'User account confirmed successfully',
    USER_ALREADY_CONFIRMED: 'User account has been already confirmed',
    USER_NOT_ACTIVE: 'User account is not active',
    USER_ACTIVE_OK: 'User account activated successfully',
    USER_INACTIVE_OK: 'User account deactivated successfully',
};
