import 'colors';
const log_error = (err, req, res, next) => {
    console.error(err.stack.red);
};
const error_handler = (err, status, req, res, next) => {
    return res.status(status).json({
        success: false,
        message: err.message,
        data: err
    });
};
export { log_error, error_handler };
