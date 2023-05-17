const pcVN = require("pc-vn");

const wardController = {
  getWards: async (req, res) => {
    try {
      const wards = pcVN.getWards();
      res
        .status(200)
        .json({
          status: 200,
          message: "Lấy danh sách tất cả phường xã thành công.",
          payload: wards,
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getWardById: async (req, res) => {
    try {
      const wards = pcVN.getWards();
      wards.forEach((item) => {
        if (item.code == req.body.code) {
          const ward = {
            code: item.code,
            name: item.name,
            unit: item.unit,
            district_code: item.district_code,
            district_name: item.district_name,
            province_code: item.province_code,
            province_name: item.province_name,
            full_name: item.full_name,
          };
          res
            .status(200)
            .json({
              status: 200,
              message: "Lấy phường xã theo mã thành công.",
              payload: ward,
            });
        }
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getWardsByDistrict: async (req, res) => {
    try {
      const wards = pcVN.getWardsByDistrictCode(req.body.district);
      res
        .status(200)
        .json({
          status: 200,
          message: "Lấy danh sách phường xã theo quận huyện thành công.",
          payload: wards,
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getWardsByProvince: async (req, res) => {
    try {
      const wards = pcVN.getWardsByProvinceCode(req.body.province);
      res
        .status(200)
        .json({
          status: 200,
          message: "Lấy danh sách phường xã theo tỉnh thành thành công.",
          payload: wards,
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = wardController;
