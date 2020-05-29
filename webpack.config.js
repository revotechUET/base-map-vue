const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDev = process.env.NODE_ENV.trim() === "dev" ? true:false;
console.log(`building in dev mode: ${isDev}`);

const plugins =  [
    new HardSourceWebpackPlugin(),
    new HtmlWebpackPlugin({ template: `./index.html` })
];

module.exports = {
    context: __dirname + '/src',
    mode: isDev ? "development":"production",
    devtool: (isDev || true) ? "cheap-module-eval-source-map":false,
    optimization: {
        minimize: isDev ? false:true
    },
    devServer: {
        contentBase: __dirname + '/dist',
        watchContentBase: true,
        compress: true,
        bonjour: true,
        clientLogLevel: 'debug',
        port: 3000
    },
    entry: {
        main: `./index.js`
    },
    output: {
        path: __dirname + "/dist",
        filename: "index.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [ 'html-loader' ]
            }, {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ],
            },
            {
                test: /\.less$/,
                use: [ 'style-loader', 'css-loader', 'less-loader' ],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [ 'url-loader' ],
            }
        ],
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js' // sử dụng 'vue/dist/vue.common.js' nếu là webpack 1
        }
    },
    plugins
}