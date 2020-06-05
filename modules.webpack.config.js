const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDev = process.env.NODE_ENV.trim() === "dev" ? true:true;
console.log(`building in dev mode: ${isDev}`);

const plugins =  [
    new HardSourceWebpackPlugin(),
];

function moduleFactoryFn(options) {
    return {
        context: __dirname + '/src',
        // TODO: only development works well, review later
        mode: (isDev || true) ? "development" : "production",
        devtool: (isDev || true) ? "cheap-module-eval-source-map" : false,
        optimization: {
            minimize: isDev ? false : true
        },
        entry: {
            main: options.entryPath
        },
        output: {
            path: __dirname + "/dist",
            filename: options.outputFileName 
        },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: ['html-loader']
                }, {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.less$/,
                    use: ['style-loader', 'css-loader', 'less-loader'],
                },
                {
                    test: /\.(png|jpg|gif)$/i,
                    use: ['url-loader'],
                }
            ],
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            }
        },
        plugins: [
            ...plugins
        ]
    };
}

module.exports = [{
    context: __dirname + '/src',
    // TODO: only development works well, review later
    mode: (isDev || true) ? "development":"production",
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
    plugins: [ 
        new HtmlWebpackPlugin({ template: `./index.html` }),
        ...plugins
    ]
},
    moduleFactoryFn({entryPath: "./dialogs/index.js", outputFileName: "dialogs.module.js"}),
    moduleFactoryFn({entryPath: "./directives/resizable-container/index.js", outputFileName: "resizable.directive.js"}),
    moduleFactoryFn({entryPath: "./components/menu-bar/index.js", outputFileName: "menuBar.component.js"}),
]