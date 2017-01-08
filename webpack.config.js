'use strict';

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const env = process.env;
const plugins = [];
const suffix = env.MIN? '.min.js' : '.js';
const nodepath = path.resolve('node_modules/');

const babelLoader = env.ES6? {
    test : /\.js$/,
    loader : 'babel?plugins[]=transform-es2015-modules-commonjs&compact=false',
    // exclude: [nodepath]
} : {
    test : /\.js$/,
    loader : 'babel?presets[]=latest&compact=false',
    // exclude: [nodepath]
};

const styleLoader = {
    test : /\.css$/,
    loader : 'style-loader!css-loader!postcss-loader'
};

if(env.MIN) {
    if(env.ES6) throw Error('Minification requires transpiling to ES5');
    const uglifyjsOptions = {
        compress : { warnings : false },
        mangle : { keep_fnames : true },
        comments : false
    };
    const uglifyjsPlugin = new webpack.optimize.UglifyJsPlugin(uglifyjsOptions);
    plugins.push(uglifyjsPlugin);
}

module.exports = {
    plugins,
    resolve : { modulesDirectories : ['node_modules'] },
    watch : Boolean(env.WATCH)
};

const assign = Object.assign;

switch(env.ENTRY) {
    case 'index':
        assign(module.exports, {
            entry : {
                index : ['./src/index'],
            },
            output : {
                path : path.join(__dirname, '/build/'),
                filename : 'build.[name]' + suffix,
                pathinfo : !env.MIN
            },
            module : {
                loaders : [babelLoader, styleLoader],
            },
            postcss : () => [autoprefixer],
        });
        break;
}
