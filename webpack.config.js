module.exports = {
    entry: "./src/squery.js",
    output: {
        path: 'dist',
        filename: "squery.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};