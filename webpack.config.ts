import * as path from "path";
import { Configuration } from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";

interface Env {
  production?: boolean;
}

const PUBLIC_URL = "/";

const config = (env: Env = {}): Configuration => ({
  context: __dirname,
  entry: "./src/index.tsx",
  output: {
    pathinfo: !env.production,
    path: path.join(__dirname, "build"),
    filename: "[name].[chunkhash:8].js",
    chunkFilename: "[name].[chunkhash:8].chunk.js",
    publicPath: PUBLIC_URL
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            silent: true,
            transpileOnly: true,
            compilerOptions: {
              module: "es2015",
              ...env.production ? { target: "es5" } : {}
            }
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new (require("fork-ts-checker-webpack-plugin"))({ silent: true }),
    new HtmlWebpackPlugin({
      minify: env.production ? {} : false,
      template: path.join(__dirname, "public/index.html")
    })
  ]
});

export = config;
