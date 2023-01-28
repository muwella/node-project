export const error_handler = (err, status, req, res, next) => {
    let message = '';
    if (err instanceof Error)
        message = err.message;
    return res.status(status).json({
        success: false,
        message,
        data: err
    });
};
export const log_error = (err) => {
    console.error(err);
};
