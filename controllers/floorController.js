const model =
    require("../models/floorModel");

exports.getFloors =
    async (req, res) => {

    try {

        // ✅ dùng params
        const blockId =
            req.params.blockId;

        console.log(
            "BLOCK ID =",
            blockId
        );

        if (!blockId) {

            return res.json([]);
        }

        const data =
            await model.getFloorsByBlock(
                blockId
            );

        res.json(data);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Lỗi load floors"
        });
    }
};