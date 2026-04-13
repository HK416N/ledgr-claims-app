const getLatestRates = async (req, res) => {
    try {
        const response = await fetch(
            `api-placeholder` //wip
        );

        res.json({
            success:true,
            data: json.data,
        })
    } catch (error) {

    }
}

module.exports= {getLatestRates};