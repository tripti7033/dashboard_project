import express, { Request, Response} from 'express'
import cors from 'cors';
import axios from 'axios';

import {AppDataSource} from './data-source'
import { Year } from './entity/year';
import { Geography } from './entity/geography';
import { Organisation } from './entity/organisation';
import { Tenderer } from './entity/tenderer';


const app = express();

app.use(express.json())
app.use(cors())
const port = 3000;

app.get('/', (req, res) => {
    res.send('hello');
})

app.post('/year', async (req:Request, res:Response ) => {
 try{
     const response1 = await axios.post('https://edsdataprocessfunction.azurewebsites.net/api/GetYear',
     {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      });
     const result1 = response1.data;
     const parsedData1 = JSON.parse(result1?.Value);
     const finalData1 = parsedData1?.result?.data_array;
     console.log(finalData1);

     const yearRepo = AppDataSource.getRepository(Year)


     for (const item of finalData1) {
        const newYearData = yearRepo.create({
            yearData: item[0],
        });
        await yearRepo.save(newYearData);
    }

 } catch (err) {
    console.log(err);

    return res.json ({
        msg: 'fail to load'
    })
 }
})

app.post('/geography', async (req: Request, res: Response ) => {
    try{
        const response2 = await axios.post('https://edsdataprocessfunction.azurewebsites.net/api/GetGeography',
{},
 {
   headers: {
     'Content-Type': 'application/json',
   },
 });
 const result2 = response2.data;
 const parsedData2 = JSON.parse(result2?.Value);
 const finalData2 = parsedData2?.result?.data_array;
console.log(finalData2);

const geoRepo = AppDataSource.getRepository(Geography)

for (const item of finalData2) {
    const newGeoData = geoRepo.create({
        geograpgyData: item[0],
    });
    await geoRepo.save(newGeoData);
}

return res.json ({
    msg: 'geography data successfully added',
})  
    } catch (err) {
       console.log(err);

       return res.json ({
           msg: 'fail to load'
       })
    }
   })


app.post('/organisation', async(req: Request, res: Response) => {
    try{
        const response3 = await axios.post('https://edsdataprocessfunction.azurewebsites.net/api/GetOrganization', {},
        {
            headers: { 'Content-Type': 'Application/json'}
        })

        const result3 = response3.data;
        const parsedData3 = JSON.parse(result3?.Value);
        const finalData3 = parsedData3?.result?.data_array
        console.log(finalData3);
        

        const organisationRepo = AppDataSource.getRepository(Organisation);
        for(let item of finalData3) {
            const newOrgData = organisationRepo.create({
                organisationData: item[0],
            })
            await organisationRepo.save(newOrgData)
        }

        return res.json ({
            msg: "organisation data added successfully"
        })

    }catch (err) {
        console.log(err);
 
        return res.json ({
            msg: 'fail to load'
        })
     }
})

app.post('/tenderer', async(req: Request, res: Response) => {
    try{
        const response4 = await axios.post('https://edsdataprocessfunction.azurewebsites.net/api/GetTenderers', {},
        {
            headers: { 'Content-Type': 'Application/json'}
        })

        const result4 = response4.data;
        const finalData4 = JSON.parse(result4?.Value);
        console.log(finalData4);
        

        const tendererRepo = AppDataSource.getRepository(Tenderer);
        for(let item of finalData4) {
            const newOrgData = tendererRepo.create({
                tendererData: item[0],
            })
            await tendererRepo.save(newOrgData)
        }

        return res.json({
            msg: 'organisation data added successfully',
        })

    }catch (err) {
        console.log(err);
 
        return res.json ({
            msg: 'fail to load'
        })
     }
})


app.get('/dropdown',async (req: Request, res: Response) => {
    try{

        const yearDropdownRepo = AppDataSource.getRepository(Year);
        const geographyDropdownRepo = AppDataSource.getRepository(Geography);
        const organisationDropdownRepo = AppDataSource.getRepository(Organisation);
        const tendererDropdownRepo = AppDataSource.getRepository(Tenderer);
        
        const yearDropdown = await yearDropdownRepo.find();
        const geographyDropdown = await geographyDropdownRepo.find();
        const organisationDropdown = await organisationDropdownRepo.find();
        const tendererDropdown = await tendererDropdownRepo.find();
        
        const dropdown = {
            yearDropdown,
            geographyDropdown,
            organisationDropdown,
            tendererDropdown
        }

        return res.json(dropdown)
        
    } catch (err) {
        console.log(err);
 
        return res.json ({
            msg: 'fail to load'
        })
     }
    
})


AppDataSource.initialize()
.then(() => {
    console.log('connection successful');
    app.listen(port, () => {
        console.log(`app listening at ${port}`);
    })
})
.catch ((err: Error) => {
    console.log(err);
})