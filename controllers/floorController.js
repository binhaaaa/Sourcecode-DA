const model = require("../models/floorModel");

exports.getFloors = async (req, res) => {
    const data = await model.getFloorsByBlock(req.params.blockId);
    res.json(data);
};