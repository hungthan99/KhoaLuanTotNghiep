const District = require("../models/District");

const districtController = {
  getDistricts: async (req, res) => {
    try {
      const districts = await District.find();
      const items = [];
      districts.forEach((district) => {
        const item = {
          id: district.id,
          idProvince: district.idProvince,
          idDistrict: district.idDistrict,
          name: district.name,
        }
        items.push(item);
      })
      res.status(200).json({
        status: 200,
        message: "Lấy danh sách tất cả quận huyện thành công.",
        payload: items,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getDistrictById: async (req, res) => {
    try {
      const district = await District.findOne({ idDistrict: req.body.code });
      const item = {
        id: district.id,
        idProvince: district.idProvince,
        idDistrict: district.idDistrict,
        name: district.name,
      }
      res.status(200).json({
        status: 200,
        message: "Lấy quận huyện theo mã thành công.",
        payload: item,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getDistrictsByProvince: async (req, res) => {
    try {
      const districts = await District.find({
        idProvince: req.body.province,
      });
      const items = [];
      districts.forEach((district) => {
        const item = {
          id: district.id,
          idProvince: district.idProvince,
          idDistrict: district.idDistrict,
          name: district.name,
        }
        items.push(item);
      })
      res.status(200).json({
        status: 200,
        message: "Lấy danh sách quận huyện theo tỉnh thành thành công.",
        payload: items,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = districtController;
