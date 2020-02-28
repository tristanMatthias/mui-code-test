import htmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import PluginTerser from 'terser-webpack-plugin';
import webpack from 'webpack';

const DIST = path.resolve(__dirname, 'dist');


export default (_env: any, options: { mode: string }) => {
  const IS_PROD = options.mode === 'production';

  return {
    entry: [
      './src/index.tsx'
    ],
    output: {
      filename: 'pane.js',
      publicPath: '/admin',
      path: DIST
    },
    devtool: IS_PROD ? false : 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loaders: [
            'babel-loader',
            {
              loader: 'ts-loader', options: {
                // configFile: path.resolve(__dirname, './tsconfig.client.json'),
                allowTsInNodeModules: true,
                compilerOptions: {
                  sourceMap: !IS_PROD
                }
              }
            }
          ]
        },
        {
          test: /\.(css|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        }
      ]
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles.css',
        chunkFilename: 'styles.css'
      }),
      new htmlWebpackPlugin({
        title: 'Panes',
        template: './src/index.html'
      })
    ],

    devServer: {
      contentBase: DIST,
      compress: true,
      port: 8888,
      historyApiFallback: true,
      writeToDisk: true
    },

    optimization: {
      minimize: true,
      minimizer: [new PluginTerser()]
    }
  } as webpack.Configuration;
};
