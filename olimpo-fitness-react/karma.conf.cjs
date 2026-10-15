const path = require("path");
const fs = require("fs/promises");
const { createInstrumenter } = require("istanbul-lib-instrument");

module.exports = function (config) {
  config.set({
    frameworks: ["jasmine"],

    files: [
      "tests/**/*.spec.js"
    ],

    preprocessors: {
      "tests/**/*.spec.js": ["esbuild"]
    },

    esbuild: {
      bundle: true,
      platform: "browser",
      target: "es2020",
      format: "iife",
      sourcemap: "inline",

      loader: {
        ".js": "jsx",
        ".jsx": "jsx"
      },

      plugins: [
        {
          name: "instrumentar-cobertura",
          setup(build) {
            build.onLoad(
              {
                filter: /[\\/]src[\\/].*\.(js|jsx)$/
              },
              async (args) => {
                const codigo = await fs.readFile(
                  args.path,
                  "utf8"
                );

                const instrumento = createInstrumenter({
                  esModules: true,
                  compact: false,
                  coverageVariable: "__coverage__",
                  parserPlugins: ["jsx"]
                });

                const codigoInstrumentado =
                  instrumento.instrumentSync(
                    codigo,
                    args.path
                  );

                console.log(
                  "[INSTRUMENTADO]",
                  path.relative(__dirname, args.path)
                );

                return {
                  contents: codigoInstrumentado,
                  loader: args.path.endsWith(".jsx")
                    ? "jsx"
                    : "js"
                };
              }
            );
          }
        }
      ]
    },

    plugins: [
      "karma-jasmine",
      "karma-chrome-launcher",
      "karma-esbuild",
      "karma-coverage"
    ],

    browsers: ["ChromeHeadless"],

    reporters: ["progress", "coverage"],

    coverageReporter: {
      dir: path.join(__dirname, "coverage"),
      reporters: [
        { type: "html", subdir: "html" },
        { type: "text-summary" }
      ]
    },

    singleRun: true
  });
};