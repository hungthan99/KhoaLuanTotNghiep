// const Province = require('../models/Province');
const pcVN = require('pc-vn');

const provinceController = {

    getProvinces: async(req, res) => {
        try {
            const provinces = pcVN.getProvinces();
            res.status(200).json({status: 200, message: 'Lấy danh sách tất cả tỉnh thành thành công.', payload: provinces});
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    },

    getProvinceById: async(req, res) => {
        try {
            const provinces = pcVN.getProvinces();
            provinces.forEach((item) => {
                if(item.code == req.body.code) {
                    const province = {
                        'code': item.code,
                        'name': item.name,
                        'unit': item.unit
                    }
                    res.status(200).json({status: 200, message: 'Lấy tỉnh thành theo mã thành công.', payload: province});
                }
            });        
        } catch (err) {
            res.status(500).json(err);
            console.log(err);
        }
    }
}

module.exports = provinceController;