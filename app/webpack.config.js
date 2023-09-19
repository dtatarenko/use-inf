const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (webpackEnv) {
    const isDevServer = webpackEnv?.WEBPACK_SERVE === true;
    const isEnvDevelopment = webpackEnv === 'development' || isDevServer;
    const isEnvProduction = webpackEnv === 'production';

    return {
        entry: './src/index.tsx',
        output: {
            filename: 'app.js',
            path: path.resolve(__dirname, './dist'),
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.module\.scss$/,
                    use: [
                        isEnvDevelopment && require.resolve('style-loader'),
                        isEnvProduction && {
                            loader: MiniCssExtractPlugin.loader,
                            options: {},
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isEnvProduction,
                                importLoaders: 1,
                                modules: true,
                            },
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: require.resolve('sass-loader'),
                            options: {
                                sourceMap: true,
                            },
                        }
                    ],
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.svg$/,
                    use: 'file-loader',
                },
                {
                    test: /\.css$/,
                    use: 'css-loader',
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                inject: true
            }),
        ],
        devServer: {
            watchFiles: path.join(__dirname, './src'),
            compress: true,
            port: 9099,
        },
    };
}