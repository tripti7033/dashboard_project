import React, { useEffect, useState } from 'react';
import './App.css';
import {
  Backdrop,
  Box,
  CircularProgress,
  FormHelperText,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';
import EuroIcon from '@mui/icons-material/Euro';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import PropTypes from 'prop-types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          p={2}
          marginLeft={6}
          height={500}
          style={{ backgroundColor: "rgba(128, 125, 122, 0.2)" }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

interface Item {
  id: number;
  yearData: string;
  
}
interface Item2 {
  id: number;
  geograpgyData: string;
  
}
interface Item3 {
  id: number;
  organisationData: string;
  
}
interface Item4 {
  id: number;
  tendererData: string;
  
}

const App: React.FC = () => {
  const [value, setValue] = useState<number>(0);

  const [year, setYear] = useState<Item[]>([]);
  const [geography, setGeography] = useState<Item2[]>([]);
  const [organisation, setOrganisation] = useState<Item3[]>([]);
  const [Tenderer, setTenderer] = useState<Item4[]>([]);

  const [selected1, setSelected1] = useState<string>('All');
  const [selected2, setSelected2] = useState<string>('All');
  const [selected3, setSelected3] = useState<string>('All');
  const [selected4, setSelected4] = useState<string>('All');

  const [overviewData, setOverviewData] = useState([]);
  const [tenderData, setTenderData] = useState([]);
  const [bidsData, setBidsData] = useState([]);

  const [open, setOpen] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const handleFilter = () => {
    setSelected1('All');
    setSelected2('All');
    setSelected3('All');
    setSelected4('All');
  };

  const handleYear = (e: SelectChangeEvent<string>) => {
    setSelected1(e?.target?.value);
  };
  const handleGeography = (e: SelectChangeEvent<string>) => {
    setSelected2(e?.target.value);
  };
  const handleOrganisation = (e: SelectChangeEvent<string>) => {
    setSelected3(e?.target?.value);
  };
  const handleTenderer = (e: SelectChangeEvent<string>) => {
    setSelected4(e?.target?.value);
  };

useEffect(() => {
  setOpen(true);
  const fetchData = async () => {
    try{
      const response1 = await axios('http://localhost:3000/dropdown')
      const result = response1.data;

      // console.log("result", result.tendererDropdown);
      setYear(result.yearDropdown);
      setGeography(result.geographyDropdown);
      setOrganisation(result.organisationDropdown);
      setTenderer(result.tendererDropdown)

    } catch(err) {
      console.log(err);
      
    }
    finally {
      setOpen(false);
    }

  }
  fetchData();

},[])


  useEffect(() => {
    const requestBody = {
      ParamTenderBids: {
        year: selected1 === 'All'? '' : `${selected1}`,
        geography: selected2 === 'All'? '' : `'${selected2}'`,
        organization: selected3 === 'All'? '' : `'${selected3}'`,
        tenderers: selected4 === 'All'? '' : `'${selected4}'`,
      },
    };

    const fetchData = async () => {
      try {
        setOpen(true);
        const response = await axios.post(
          '/api/GetOverviewKpiDetails',
          JSON.stringify(requestBody),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const result = response.data;
        const dataa = JSON.parse(result.Value);
        setOverviewData(dataa.result.data_array);

      } catch (error) {
        console.log(error);
      } finally {
        setOpen(false);
      }
    };

    fetchData();
  }, [selected1, selected2, selected3, selected4]);

  const data2: string[] = overviewData.length > 0 ? overviewData[0] : [];

  const data1: string[] =
    data2[0] !== '0'
      ? data2.map((value) => {
          const number = parseFloat(value);

          if (number < 1000) {
            return number.toFixed(2);
          } else if (number < 1000000) {
            return (number / 1000).toFixed(2) + 'K';
          } else if (number < 1000000000) {
            return (number / 1000000).toFixed(2) + 'M';
          } else if (number < 1000000000000) {
            return (number / 1000000000).toFixed(2) + 'M';
          } else {
            return (number / 1000000000000).toFixed(2) + 'C';
          }
        })
      : data2;

  useEffect(() => {
    const requestBody = {
      ParamTenderBids: {
        year: selected1 === 'All' ? '' : `${selected1}`,
        geography: selected2 === 'All' ? '' : `'${selected2}'`,
        organization: selected3 === 'All' ? '' : `'${selected3}'`,
        tenderers: selected4 === 'All' ? '' : `'${selected4}'`,
      },
    };

    const fetchData = async () => {
      try {
        setOpen(true);
        const response = await axios.post(
          '/api/GetBidsKpiDetails',
          JSON.stringify(requestBody),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const result = response.data;
        // console.log(result);

        const data = JSON.parse(result.Value);
        setBidsData(data.result.data_array);
      } catch (error) {
        console.log(error);
      } finally {
        setOpen(false);
      }
    };

    fetchData();
  }, [selected1, selected2, selected3, selected4]);
  // console.log('bidsData',bidsData);

  const bids2: string[] = bidsData.length > 0 ? bidsData[0] : [];

  const bids1: string[] =
    bids2[0] !== '0'
      ? bids2.map((value) => {
          const number = parseFloat(value);
          if (number < 1000) {
            return number.toFixed(2);
          } else if (number < 1000000) {
            return (number / 1000).toFixed(2) + 'K';
          } else if (number < 1000000000) {
            return (number / 1000000).toFixed(2) + 'M';
          } else if (number < 1000000000000) {
            return (number / 1000000000).toFixed(2) + 'B';
          } else {
            return (number / 1000000000000).toFixed(2) + 'C';
          }
        })
      : bids2;
  // console.log('bids1', bids1);

  useEffect(() => {
    const requestBody = {
      ParamTenderBids: {
        year: selected1 === 'All' ? '' : `${selected1}`,
        geography: selected2 === 'All' ? '' : `'${selected2}'`,
        organization: selected3 === 'All' ? '' : `'${selected3}'`,
        tenderers: selected4 === 'All'?  '' : `'${selected4}'`,
      },
    };
    const fetchData = async () => {
      try {
        setOpen(true);
        const response = await axios.post(
          '/api/GetTendersKpiDetails',
          JSON.stringify(requestBody),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const result = response.data;
        const data = JSON.parse(result.Value);
        setTenderData(data.result.data_array);
      } catch (error) {
        console.log(error);
      } finally {
        setOpen(false);
      }
    };

    fetchData();
  }, [selected1, selected2, selected3, selected4]);

  const tender2: string[] = tenderData.length > 0 ? tenderData[0] : [];

  const tender1: string[] =
    tender2[0] !== '0'
      ? tender2.map((value) => {
          const number = parseFloat(value);
          if (number < 1000) {
            return number.toFixed(2);
          } else if (number < 1000000) {
            return (number / 1000).toFixed(2) + 'K';
          } else if (number < 1000000000) {
            return (number / 1000000).toFixed(2) + 'M';
          } else if (number < 1000000000000) {
            return (number / 1000000000).toFixed(2) + 'B';
          } else {
            return (number / 1000000000000).toFixed(2) + 'C';
          }
        })
      : tender2;
  const theme = {
    backgroundColor: 'rgb(60, 129, 248)',
    color: 'white',
  };

  return (
    <Box>
        <Box  display="flex">
          <Typography
            variant="h4"
            sx={{ marginTop: "22px", marginLeft: "16px", }}
          >
            {" "}
            Tenders and Bids Report
          </Typography>

          <Tabs
            value={ value }
            onChange={ handleChange }
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{ height: "70px", marginTop: "20px", marginLeft: "320px", }}
          >
            <Tab
              value={0}
              label="Overview"
              wrapped
              sx={{
                fontSize: "20px",
                width: "180px",
                color: "black",
                height: "70px",
                borderRight: "3px solid white",
              }}
              style={value === 0 ? theme : { backgroundColor: "lightgray" }}
            />
            <Tab
              value={1}
              label="Tender"
              sx={{
                fontSize: "20px",
                width: "180px",
                color: "black",
                borderRight: "3px solid white",
              }}
              style={value === 1 ? theme : { backgroundColor: "lightgray" }}
            />
            <Tab
              value={2}
              label="Bids"
              sx={{
                fontSize: "20px",
                width: "180px",
                color: "black",
                borderRight: "3px solid white",
              }}
              style={value === 2 ? theme : { backgroundColor: "lightgray" }}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Box display="flex" justifyContent="space-evenly">
              <Box width="250px" height="100px"  sx={{
                background: "white",
                padding: "1rem",
                paddingTop: "0rem",
              }}>
                <FormHelperText
                  sx={{
                    fontSize: 16,
                    color: "rgb(85,85,85)",
                    fontWeight: "bold",
                    paddingBottom: "0.5rem",
                  }}
                >
                  Time Period
                </FormHelperText>
                <Select
                  displayEmpty
                  value={selected1}
                  onChange={handleYear}
                  fullWidth
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  <MenuItem value="All">{selected1}</MenuItem>
                  {year.map((item, i) => (
                    <MenuItem value={ item.yearData } key={i}>
                      { item.yearData }
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box width="250px" height="100px"  sx={{
                background: "white",
                padding: "15px",
                paddingTop: "0px",
              }}>
                <FormHelperText
                  sx={{
                    fontSize: 16,
                    color: "rgb(85,85,85)",
                    fontWeight: "bold",
                    paddingBottom: "10px",
                  }}
                >
                  Geography
                </FormHelperText>
                <Select
                  displayEmpty
                  value={selected2}
                  onChange={handleGeography}
                  fullWidth
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  <MenuItem value="All">{selected2}</MenuItem>
                  {geography.map((item, i) => (
                    <MenuItem value={ item.geograpgyData } key={i}>
                      { item.geograpgyData }
                    </MenuItem>
                  ))}
                </Select>
              </Box>

             <Box width="250px" height="100px"  sx={{
                background: "white",
                padding: "15px",
                paddingTop: "0px",
              }}>
                <FormHelperText
                  sx={{
                    fontSize: 16,
                    color: "rgb(85,85,85)",
                    fontWeight: "bold",
                    paddingBottom: "10px",
                  }}
                >
                  Organization
                </FormHelperText>
                <Select
                  displayEmpty
                  value={selected3}
                  onChange={handleOrganisation}
                  fullWidth
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  <MenuItem value="All">{ selected3 }</MenuItem>
                  {organisation.map((item, i) => (
                    <MenuItem value={ item.organisationData} key={i}>
                      { item.organisationData }
                    </MenuItem>
                  ))}
                </Select>
              </Box>
           
             <Box width="250px" height="100px" sx={{
                background: "white",
                padding: "15px",
                paddingTop: "0px",
              }}>
                <FormHelperText
                  sx={{
                    fontSize: 16,
                    color: "rgb(85,85,85)",
                    fontWeight: "bold",
                    paddingBottom: "10px",
                  }}
                >
                  Tenderer
                </FormHelperText>
                <Select
                  displayEmpty
                  value={selected4}
                  onChange={handleTenderer}
                  fullWidth
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  <MenuItem value="All">{ selected4 }</MenuItem>
                  {Tenderer.map((item, i) => (
                    <MenuItem value={ item.tendererData } key={i}>
                      { item.tendererData }
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            <button onClick={handleFilter} className="filterBtn">
              Clear Filter
            </button>
          </Box>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
         
            <Box display= "flex" justifyContent="space-around" marginTop= "15px">
              <Paper sx={{width: "260px",
              height: "130px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: " rgba(28, 28, 115,0.7)",
                }}
               >
                <span style={{ fontSize: "25px", color: "white" }}>
                  { data1[0] ?? 0 }
                </span>
                <span  style={{ fontSize: "18px", color: "white", }}>
                  <LayersOutlinedIcon />
                  Number of Tenders
                </span>
              </Paper>


              <Paper sx={{width: "260px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "rgb(206, 96, 56)",
                }}
              >
                <span style={{ fontSize: "25px", color: "white", }}> { data1[1] ?? 0 } </span>
                <span style={{ fontSize: "18px", color: "white", }}>
                  <GavelOutlinedIcon /> Total Number of Bids
                </span>
              </Paper>

              <Paper
                sx={{ width: "260px",
                 display: "flex",
                 flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "rgb(60, 129, 248)",
              }}
              >
                <span  style={{ fontSize: "25px", color: "white", }}>
                  <EuroIcon />
                  <span>{data1[2] ?? 0}</span>
                </span>
                <span style={{ fontSize: "18px", color: "white", }}>
                  <ShoppingBagOutlinedIcon /> Total Awarded value{" "}
                </span>
              </Paper>

              <Paper
                sx={{
                  width: "260px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "rgba(1, 135, 1,0.7)",
                }}
              >
                <span style={{ fontSize: "25px", color: "white", }}>
                  <EuroIcon />
                  <span >{ data1[3] ?? 0 }</span>
                </span>
                <span style={{ fontSize: "18px", color: "white", }}>
                  <PaymentsOutlinedIcon />
                  Total Paid Value
                </span>
              </Paper>
            </Box>
        </TabPanel>
{/* ----------------------------------------         Tender          ----------------------------- */}
        <TabPanel value={value} index={1}>
        <Box display="flex" justifyContent="space-evenly">
            
              <Box width="250px" height="100px" sx={{
                background: "white",
                padding: "15px",
                paddingTop: "0px",
              }}>
                <FormHelperText
                  sx={{
                    fontSize: 16,
                    color: "rgb(85,85,85)",
                    fontWeight: "bold",
                    paddingBottom: "10px",
                  }}
                >
                  Time Period
                </FormHelperText>
                <Select
                  displayEmpty
                  value={selected1}
                  onChange={handleYear}
                  fullWidth
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  <MenuItem value="All">{selected1}</MenuItem>
                  {year.map((item, i) => (
                    <MenuItem value={item.yearData} key={i}>
                      {item.yearData}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
           
              <Box width="250px" height="100px" sx={{
                background: "white",
                padding: "15px",
                paddingTop: "0px",
              }}>
                <FormHelperText
                  sx={{
                    fontSize: 16,
                    color: "rgb(85,85,85)",
                    fontWeight: "bold",
                    paddingBottom: "10px",
                  }}
                >
                  Geography
                </FormHelperText>
                <Select
                  displayEmpty
                  value={selected2}
                  onChange={handleGeography}
                  fullWidth
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  <MenuItem value="All">{selected2}</MenuItem>
                  {geography.map((item, i) => (
                    <MenuItem value={item.geograpgyData} key={i}>
                      {item.geograpgyData}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            
              <Box width="250px" height="100px" sx={{
                background: "white",
                padding: "15px",
                paddingTop: "0px",
              }}>
                <FormHelperText
                  sx={{
                    fontSize: 16,
                    color: "rgb(85,85,85)",
                    fontWeight: "bold",
                    paddingBottom: "10px",
                  }}
                >
                  Organization
                </FormHelperText>
                <Select
                  displayEmpty
                  value={selected3}
                  onChange={handleOrganisation}
                  fullWidth
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  <MenuItem value="All">{selected3}</MenuItem>
                  {organisation.map((item, i) => (
                    <MenuItem value={item.organisationData} key={i}>
                      {item.organisationData}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
           
             <Box width="250px" height="100px" sx={{
                background: "white",
                padding: "15px",
                paddingTop: "0px",
              }}>
                <FormHelperText
                  sx={{
                    fontSize: 16,
                    color: "rgb(85,85,85)",
                    fontWeight: "bold",
                    paddingBottom: "10px",
                  }}
                >
                  Tenderer
                </FormHelperText>
                <Select
                  displayEmpty
                  value={selected4}
                  onChange={handleTenderer}
                  fullWidth
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  <MenuItem value="All">{selected4}</MenuItem>
                  {Tenderer.map((item, i) => (
                    <MenuItem value={item.tendererData} key={i}>
                      {item.tendererData}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
           
            <button onClick={handleFilter} className="filterBtn">
              Clear Filter
            </button>
          </Box>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Box sx={{
            display: "flex",
            marginTop: "15px",
          }}>
              <Paper
                sx={{
                  background: "rgba(28, 28, 115,0.7)",
                  borderRight: "1px solid white",
                  width: "400px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontSize: "25px", color: "white", }}>{tender1[0] ?? 0}</span>
                <span style={{ fontSize: "18px", color: "white", }}>
                  <LayersOutlinedIcon />
                  Number of Tenders
                </span>
              </Paper>
              <Paper
                sx={{
                  background: "rgba(28, 28, 115,0.7)",
                  borderRight: "1px solid white",
                  width: "400px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <span  style={{ fontSize: "25px", color: "white", }}>
                  <EuroIcon />
                  <span>{tender1[1] ?? 0}</span>
                </span>
                <span style={{ fontSize: "18px", color: "white", }}>
                  <PaymentsOutlinedIcon />
                  Total Tender Value
                </span>
              </Paper>
              <Paper
                sx={{
                  background: "rgba(28, 28, 115,0.7)",
                  width: "400px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "25px", color: "white", }}>{tender1[2] ?? 0}</span>
                <span style={{ fontSize: "18px", color: "white", }}>
                  <GavelOutlinedIcon /> Number of Bids
                </span>
              </Paper>
            {/* </ButtonGroup> */}
          </Box>
        
        </TabPanel>

        {/* ------------------------------------     Bids   -------------------------------- */}

        <TabPanel value={value} index={2}>
        <Box display="flex" justifyContent="space-evenly">
              <Box width="250px" height="100px" sx={{
                background: "white",
                padding: "1rem",
                paddingTop: "0rem",
              }}>
                <FormHelperText
                  sx={{
                    fontSize: 16,
                    color: "rgb(85,85,85)",
                    fontWeight: "bold",
                    paddingBottom: "0.5rem",
                  }}
                >
                  Time Period
                </FormHelperText>
                <Select
                  displayEmpty
                  value={selected1}
                  onChange={handleYear}
                  fullWidth
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  <MenuItem value="All">{selected1}</MenuItem>
                  {year.map((item, i) => (
                    <MenuItem value={item.yearData} key={i}>
                      {item.yearData}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
           
              <Box width="250px" height="100px" sx={{
                background: "white",
                padding: "1rem",
                paddingTop: "0rem",
              }}>
                <FormHelperText
                  sx={{
                    fontSize: 16,
                    color: "rgb(85,85,85)",
                    fontWeight: "bold",
                    paddingBottom: "0.5rem",
                  }}
                >
                  Geography
                </FormHelperText>
                <Select
                  displayEmpty
                  value={selected2}
                  onChange={handleGeography}
                  fullWidth
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  <MenuItem value="All">{selected2}</MenuItem>
                  {geography.map((item, i) => (
                    <MenuItem value={item.geograpgyData} key={i}>
                      {item.geograpgyData}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
           
            
              <Box width="250px" height="100px" sx={{
                background: "white",
                padding: "1rem",
                paddingTop: "0rem",
              }}>
                <FormHelperText
                  sx={{
                    fontSize: 16,
                    color: "rgb(85,85,85)",
                    fontWeight: "bold",
                    paddingBottom: "0.5rem",
                  }}
                >
                  Organization
                </FormHelperText>
                <Select
                  displayEmpty
                  value={selected3}
                  onChange={handleOrganisation}
                  fullWidth
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  <MenuItem value="All">{selected3}</MenuItem>
                  {organisation.map((item, i) => (
                    <MenuItem value={ item.organisationData } key={i}>
                      { item.organisationData }
                    </MenuItem>
                  ))}
                </Select>
              </Box>
           
              <Box width="250px" height="100px" sx={{
                background: "white",
                padding: "1rem",
                paddingTop: "0rem",
              }}>
                <FormHelperText
                  sx={{
                    fontSize: 16,
                    color: "rgb(85,85,85)",
                    fontWeight: "bold",
                    paddingBottom: "0.5rem",
                  }}
                >
                  Tenderer
                </FormHelperText>
                <Select
                  displayEmpty
                  value={selected4}
                  onChange={handleTenderer}
                  fullWidth
                  MenuProps={{
                    PaperProps: { style: { maxHeight: 300 } },
                  }}
                >
                  <MenuItem value="All">{selected4}</MenuItem>
                  {Tenderer.map((item, i) => (
                    <MenuItem value={ item.tendererData } key={i}>
                      { item.tendererData }
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            
            <button onClick={handleFilter} className="filterBtn">
              Clear Filter
            </button>
          </Box>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Box display= "flex" marginTop="15px">
              <Paper
                sx={{
                  background: "rgb(206, 96, 56)",
                  borderRight: "1px solid white",
                  width: "400px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontSize: "25px", color: "white" }}>{bids1[0] ?? 0}</span>
                <span style={{ fontSize: "18px", color: "white" }}>
                  <GavelOutlinedIcon />
                  Number of Bids
                </span>
              </Paper>
              <Paper
                sx={{
                  background: "rgb(206, 96, 56)",
                  borderRight: "1px solid white",
                  width: "400px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontSize: "25px", color: "white" }}>
                  <EuroIcon />
                  <span>{bids1[1] ?? 0}</span>
                </span>
                <span style={{ fontSize: "18px", color: "white" }}>
                  <PaymentsOutlinedIcon />
                  Total Bids Value
                </span>
              </Paper>
              <Paper
                sx={{
                  background: "rgb(206, 96, 56)",
                  width: "400px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontSize: "25px", color: "white" }}>{bids1[2] ?? 0}</span>
                <span style={{ fontSize: "18px", color: "white" }} >
                  <LayersOutlinedIcon />
                  Number of Tenders
                </span>
              </Paper>
          </Box>
        </TabPanel>
      
      </Box>
  )}

  export default App;







