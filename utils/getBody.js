const getBody = (req) => {
    const method = req.method;

    if (method === 'GET') {
        if (req.query && req.params) {
            return { ...req.query, ...req.params };
        } else if (req.query) {
            return req.query;
        } else if (req.params) {
            return req.params;
        }
    } else if (method === 'POST') {
        return req.body;
    } else if (method === 'PUT' || method === 'PATCH') {
        if (req.body && req.params) {
            return { ...req.body, ...req.params };
        } else if (req.body) {
            return req.body;
        } else if (req.params) {
            return req.params;
        }
    } else if (method === 'DELETE') {
        if (req.body && req.params) {
            return { ...req.body, ...req.params };
        } else if (req.body) {
            return req.body;
        } else if (req.params) {
            return req.params;
        }
    }

    return {};
};

module.exports = {
    getBody,
}