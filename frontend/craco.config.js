/* eslint-disable max-len */
const path = require('path')
const CracoAlias = require('craco-alias')
const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.paths.json')
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.paths.json',
      },
    },
  ],
  webpack: {
    alias: {
      assets: path.resolve(__dirname, 'src/assets'),
      components: path.resolve(__dirname, 'src/components'),
      form: path.resolve(__dirname, 'src/form'),
      context: path.resolve(__dirname, 'src/context'),
      data: path.resolve(__dirname, 'src/data'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      pages: path.resolve(__dirname, 'src/pages'),
      services: path.resolve(__dirname, 'src/services'),
    },
    plugins: [
      new CircularDependencyPlugin({
        // `onStart` is called before the cycle detection starts
        onStart({ compilation }) {
          console.log('start detecting webpack modules cycles')
        },
        // `onDetected` is called for each module that is cyclical
        onDetected({ module: webpackModuleRecord, paths, compilation }) {
          // `paths` will be an Array of the relative module paths that make up the cycle
          // `module` will be the module record generated by webpack that caused the cycle
          const pathsWithoutNodeModules = paths.filter(
            (path) => path.indexOf('node_modules') === -1,
          )

          if (pathsWithoutNodeModules.length > 0) {
            compilation.errors.push(
              new Error(pathsWithoutNodeModules.join(' -> ')),
            )
          }
        },
        // `onEnd` is called before the cycle detection ends
        onEnd({ compilation }) {
          console.log('end detecting webpack modules cycles')
        },
      }),
    ],
  },
  jest: {
    configure: {
      preset: 'ts-jest',
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: 'frontend/src/',
      }),
      transform: {
        '^.+\\.(ts|tsx|js|jsx)?$': 'ts-jest',
      },
    },
  },
}
