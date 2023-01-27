const response = (res, status, message, data) => {
    res.status(status).json({ success: status < 300,
        message,
        data });
};
export default response;
