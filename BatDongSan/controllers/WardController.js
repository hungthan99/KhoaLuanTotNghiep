const Ward = require("../models/Ward");

const wardController = {
  getWards: async (req, res) => {
    try {
      const wards = await Ward.find();
      const items = [];
      wards.forEach((ward) => {
        const item = {
          id: ward.id,
          idDistrict: ward.idDistrict,
          idWard: ward.idWard,
          name: ward.name,
        }
        items.push(item);
      })
      res.status(200).json({
        status: 200,
        message: "Lấy danh sách tất cả phường xã thành công.",
        payload: items,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getWardById: async (req, res) => {
    try {
      const ward = await Ward.findOne({ idWard: req.body.code });
      const item = {
        id: ward.id,
        idDistrict: ward.idDistrict,
        idWard: ward.idWard,
        name: ward.name,
      }
      res.status(200).json({
        status: 200,
        message: "Lấy phường xã theo mã thành công.",
        payload: item,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getWardsByDistrict: async (req, res) => {
    try {
      const wards = await Ward.find({idDistrict: req.body.district});
      const items = [];
      wards.forEach((ward) => {
        const item = {
          id: ward.id,
          idDistrict: ward.idDistrict,
          idWard: ward.idWard,
          name: ward.name,
        }
        items.push(item);
      })
      res.status(200).json({
        status: 200,
        message: "Lấy danh sách phường xã theo quận huyện thành công.",
        payload: items,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = wardController;
