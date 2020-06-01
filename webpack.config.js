/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { resolve as _resolve } from 'path';
import { BundleAnalyzerPlugin as WBA } from 'webpack-bundle-analyzer';

const plugins = [];
if (process.env.WBA) {
  plugins.push(new WBA({ analyzerMode: 'static' }));
}

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: _resolve(__dirname, 'lib'),
    filename: '[name].js',
    libraryTarget: 'commonjs',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: [
    'fs',
    'iconv-lite',
    'pretty-data',
    'xml-js',
    'xpath-ts',
    'xregexp',
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  plugins,
};
