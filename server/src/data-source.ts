import {DataSource} from 'typeorm'
import { Year } from './entity/year'
import { Geography } from './entity/geography'
import { Tenderer } from './entity/tenderer'
import { Organisation } from './entity/organisation'

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Tripti907@",
    database: "dashboard",
    synchronize: true,
    logging: true,
    entities: [Year, Geography, Tenderer, Organisation]
    
})