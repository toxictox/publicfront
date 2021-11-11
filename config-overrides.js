const path = require("path");
module.exports = function override(config, env) {
  config = {
    ...config,
    resolve: {
      alias: {
        "~/": path.resolve(__dirname, "/src"),
        "@icons": path.resolve(__dirname, "./src/icons/"),
        "@comp": path.resolve(__dirname, "./src/components/"),
        "@pages": path.resolve(__dirname, "./src/pages/"),
        "@hooks": path.resolve(__dirname, "./src/hooks/"),
        "@lib": path.resolve(__dirname, "./src/lib/"),
        "@utils": path.resolve(__dirname, "./src/utils/"),
        "@contexts": path.resolve(__dirname, "./src/contexts/"),
        "@store": path.resolve(__dirname, "./src/store/"),
        "@slices": path.resolve(__dirname, "./src/slices/"),
        "@root": path.resolve(__dirname, "./src/"),
        "react-native": "react-native-web",
      },
    },
  };
  return config;
};
