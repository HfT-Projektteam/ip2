const path = require('path')
const CracoAlias = require('craco-alias')
const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.paths.json')

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
      components: path.resolve(__dirname, 'src/components'),
      form: path.resolve(__dirname, 'src/form'),
      context: path.resolve(__dirname, 'src/context'),
      data: path.resolve(__dirname, 'src/data'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      pages: path.resolve(__dirname, 'src/pages'),
      services: path.resolve(__dirname, 'src/services'),
    },
  },
  jest: {
    configure: {
      preset: 'ts-jest',
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: 'frontend/src/',
      }),
    },
  },
}
