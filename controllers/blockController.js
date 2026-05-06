const model = require("../models/blockModel");

exports.getBlocks = async (req, res) => {
    const data = await model.getBlocks();
    res.json(data);
};