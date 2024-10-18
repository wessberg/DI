import baseConfig from "@wessberg/ts-config/sandhog.config.js";

export default {
	...baseConfig,
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
