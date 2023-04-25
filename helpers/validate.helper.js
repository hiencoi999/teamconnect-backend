const ObjectId = require("mongoose").Types.ObjectId;

const verifyObjectId = (id) => {
    if (!ObjectId.isValid(id)) return false;
    return true
}

module.exports = {verifyObjectId}