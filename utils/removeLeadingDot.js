const removeLeadingDot = async (data) => {
    if (data && data.data && data.data.rows) {
        data.data.rows.forEach((item) => {
            if (item.fullDomain.startsWith('.')) {
                item.fullDomain = item.fullDomain.replace(/^\./, '');
            }
        });
    }
    return data;
}

module.exports = {
    removeLeadingDot
}