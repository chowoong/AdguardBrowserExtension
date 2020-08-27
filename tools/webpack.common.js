import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import path from 'path';
import { getConfig, updateLocalesMSGName } from './helpers';

const BUILD_PATH = path.resolve(__dirname, '../build');

const config = getConfig(process.env.BUILD_ENV);

const BACKGROUND_PATH = path.resolve(__dirname, '../Extension/pages/background');
const OPTIONS_PATH = path.resolve(__dirname, '../Extension/pages/options');
const POPUP_PATH = path.resolve(__dirname, '../Extension/pages/popup');
const FILTERING_LOG_PATH = path.resolve(__dirname, '../Extension/pages/filtering-log');
const FILTER_DOWNLOAD_PATH = path.resolve(__dirname, '../Extension/pages/filter-download');
const EXPORT_PATH = path.resolve(__dirname, '../Extension/pages/export');

const OUTPUT_PATH = config.outputPath;

// TODO copy web-accessible-resources from node_modules on every-build
// TODO copy scriptlets from node_modules on every-build
// TODO build sample extension with api
// TODO in dev build use sourcemaps while in prod no
// TODO check work of blocking pages
// TODO fix tests
// TODO remove gulp
export const commonConfig = {
    mode: config.mode,
    devtool: false,
    entry: {
        'pages/background': path.resolve(__dirname, BACKGROUND_PATH),
        'pages/options': path.resolve(__dirname, OPTIONS_PATH),
        'pages/popup': path.resolve(__dirname, POPUP_PATH),
        'pages/filtering-log': path.resolve(__dirname, FILTERING_LOG_PATH),
        'pages/filter-download': path.resolve(__dirname, FILTER_DOWNLOAD_PATH),
        'pages/export': path.resolve(__dirname, EXPORT_PATH),
    },
    output: {
        path: path.resolve(__dirname, BUILD_PATH, OUTPUT_PATH),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{ loader: 'babel-loader', options: { babelrc: true } }],
            },
            {
                test: /\.(css|pcss)$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader',
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    { loader: 'file-loader', options: { outputPath: 'assets' } },
                ],
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(BACKGROUND_PATH, 'index.html'),
            templateParameters: {
                browser: process.env.BROWSER,
            },
            filename: 'pages/background.html',
            chunks: ['pages/background'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(OPTIONS_PATH, 'index.html'),
            filename: 'pages/options.html',
            chunks: ['pages/options'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(POPUP_PATH, 'index.html'),
            filename: 'pages/popup.html',
            chunks: ['pages/popup'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(FILTERING_LOG_PATH, 'index.html'),
            filename: 'pages/filtering-log.html',
            chunks: ['pages/filtering-log'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(FILTER_DOWNLOAD_PATH, 'index.html'),
            filename: 'pages/filter-download.html',
            chunks: ['pages/filter-download'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(EXPORT_PATH, 'index.html'),
            filename: 'pages/export.html',
            chunks: ['pages/export'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    context: 'Extension',
                    from: 'assets',
                    to: 'assets',
                },
                {
                    context: 'Extension',
                    from: '_locales',
                    to: '_locales',
                    transform: (content) => {
                        return updateLocalesMSGName(content, process.env.BUILD_ENV, process.env.BROWSER);
                    },
                },
                {
                    context: 'Extension',
                    from: 'web-accessible-resources',
                    to: 'web-accessible-resources',
                },
                {
                    context: 'Extension',
                    from: 'lib',
                    to: 'lib',
                },
                {
                    context: 'Extension',
                    from: 'browser/webkit', // TODO figure out purpose of this separation
                },
                {
                    context: 'Extension',
                    from: 'browser/chrome',
                },
                {
                    context: 'Extension',
                    from: 'pages/blocking-pages',
                    to: 'pages/blocking-pages',
                },
            ],
        }),
    ],
};
