const path = require("path");
module.exports = [{
    entry: {
        app: ["./lib/main.js"],
    },
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/assets",
        filename: "bundle.js",
    },
    devtool: "inline-source-map",
    module: {
        rules: [{
            test: /.js?$/,
            exclude: /(mode_modules|bower_components)/,
            loader: "babel-loader",
        }, {
            test: /.json$/,
            loader: "json-loader",
        }, {
            test: /.css$/,
            loader: "style-loader!css-loader",
        }],
    },
}];
