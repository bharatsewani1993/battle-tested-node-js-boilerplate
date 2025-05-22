const getBody = (req) => {
    const method = req.method;

    const params = req.params || {};
    const query = req.query || {};
    const body = req.body || {};

    switch (method) {
        case 'GET':
            return { ...params, ...query };
        case 'POST':
        case 'PUT':
        case 'PATCH':
        case 'DELETE':
            return { ...params, ...query, ...body };
        default:
            return {};
    }
};


module.exports = {
    getBody,
}