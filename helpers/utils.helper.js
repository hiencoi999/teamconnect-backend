const getObjectKey = (obj, value) => {
    return Object.keys(obj).filter(key => obj[key] === value);
};

module.exports = { getObjectKey };
