const pcVN = require("pc-vn");

const districtController = {
  getDistricts: async (req, res) => {
    try {
      const districts = pcVN.getDistricts();
      res
        .status(200)
        .json({
          status: 200,
          message: "Lấy danh sách tất cả quận huyện thành công.",
          payload: districts,
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getDistrictById: async (req, res) => {
    try {
      const districts = pcVN.getDistricts();
      districts.forEach((item) => {
        if (item.code == req.body.code) {
          const district = {
            code: item.code,
            name: item.name,
            unit: item.unit,
            province_code: item.province_code,
            province_name: item.province_name,
            full_name: item.full_name,
          };
          res
            .status(200)
            .json({
              status: 200,
              message: "Lấy quận huyện theo mã thành công.",
              payload: district,
            });
        }
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getDistrictsByProvince: async (req, res) => {
    try {
      const districts = pcVN.getDistrictsByProvinceCode(req.body.province);
      res
        .status(200)
        .json({
          status: 200,
          message: "Lấy danh sách quận huyện theo tỉnh thành thành công.",
          payload: districts,
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = districtController;
