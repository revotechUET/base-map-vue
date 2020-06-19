const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

const plugins =  [
    new HardSourceWebpackPlugin(),
];

module.exports = {
    context: __dirname + '/src',
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    optimization: {
        minimize: false
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
        main: `./index1.js`
    },
    output: {
        path: __dirname + "/dist",
        filename: "index.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        interpolate: true
                    }
                }]
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
            },
            {
                test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [ 'file-loader' ]
            }
        ],
    },
    resolve: {
        alias: {
            'vue$': __dirname + '/node_modules/vue/dist/vue.esm.js',
            // 'vue$': 'vue/dist/vue.esm.js',
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    plugins
}