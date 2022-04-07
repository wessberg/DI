/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-check

/**
 * @type {import("helpertypes").PartialDeep<import("sandhog").SandhogConfig>}
 */
const config = {
  ...require("@wessberg/ts-config/sandhog.config.json"),
  logo: {
    url: "https://raw.githubusercontent.com/wessberg/di/master/documentation/asset/di-logo.png",
    height: 150,
  },
  readme: {
    sections: {
      exclude: ["features", "feature_image"]
    }
  }
};
module.exports = config;
