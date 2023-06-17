import { ConfigModuleOptions } from '@nestjs/config'
import * as path from 'path'

const env = process.env.ENV || 'prod'
const envPath = [
  path.resolve(__dirname, `.env.${env}`),
  path.resolve(__dirname, '.env'),
]

let configOptions: ConfigModuleOptions = {
  envFilePath: envPath,
  isGlobal: true,
}
console.log(`Config loaded: ${JSON.stringify(configOptions)}`)
export default configOptions
