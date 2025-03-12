const success = () => {
    return {
        success: true,
        data: [],
        errors: [],
        message: '',
        status: 200
    };
}

const failure = () => {
    return {
        success: false,
        data: [],
        errors: [],
        message: '',
        status: 422
    };
}

module.exports = {
    success,
    failure,
}