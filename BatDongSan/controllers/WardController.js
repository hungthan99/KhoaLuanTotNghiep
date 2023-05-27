// const pcVN = require("pc-vn");

const Ward = require("../models/Ward");

const wardController = {
  // getWards: async (req, res) => {
  //   try {
  //     const wards = pcVN.getWards();
  //     res
  //       .status(200)
  //       .json({
  //         status: 200,
  //         message: "Lấy danh sách tất cả phường xã thành công.",
  //         payload: wards,
  //       });
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // },

  // getWardById: async (req, res) => {
  //   try {
  //     const wards = pcVN.getWards();
  //     wards.forEach((item) => {
  //       if (item.code == req.body.code) {
  //         const ward = {
  //           code: item.code,
  //           name: item.name,
  //           unit: item.unit,
  //           district_code: item.district_code,
  //           district_name: item.district_name,
  //           province_code: item.province_code,
  //           province_name: item.province_name,
  //           full_name: item.full_name,
  //         };
  //         res
  //           .status(200)
  //           .json({
  //             status: 200,
  //             message: "Lấy phường xã theo mã thành công.",
  //             payload: ward,
  //           });
  //       }
  //     });
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // },

  // getWardsByDistrict: async (req, res) => {
  //   try {
  //     const wards = pcVN.getWardsByDistrictCode(req.body.district);
  //     res
  //       .status(200)
  //       .json({
  //         status: 200,
  //         message: "Lấy danh sách phường xã theo quận huyện thành công.",
  //         payload: wards,
  //       });
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // },

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
