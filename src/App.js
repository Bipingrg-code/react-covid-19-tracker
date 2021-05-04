 
  import React, {useState, useEffect} from 'react'
  import './App.css';
  import {FormControl, Select, MenuItem, Card, CardContent} from '@material-ui/core';
  import InfoBox from './components/InfoBox';
  import Map from './components/Map'
  import TableData from './components/TableData';
  import LineGraph from './components/LineGraph';

  import 'leaflet/dist/leaflet.css'


  function App() {
    // State
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("worldwide");

    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);

    const [mapCenter, setMapCenter] = useState({
      lat: 34.80746, lng: -40.4796
    })

   const [mapZoom, setMapZoom] = useState(3)

    useEffect(() => {
      countryInfoData();
    },[]);

    const countryInfoData = async () => await fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then(data => {
      setCountryInfo(data);
    });

    //https://disease.sh/v3/covid-19/countries

    //fatching data

    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
          const countries = data.map((country) => (
            {
            name: country.country,
            value: country.countryInfo.iso2
            }
          ))
          setTableData(data);

          setCountries(countries);
      })
      
    }
    useEffect(() => {
      getCountriesData();
    },[]);

    const countryHandle = async (e) => {
      const countryCode = e.target.value;
      // console.log('Country code:', countryCode);
     

      const url = countryCode === 'worldwide' 
        ? 'https://disease.sh/v3/covid-19/all'
       :`https://disease.sh/v3/covid-19/countries/${countryCode}`

       await fetch(url)
       .then(response => response.json())
       .then(data => {
        
          setCountry(countryCode);

            //All of the data...
            //From country response
          setCountryInfo(data)

          // setMapCenter([data.countryInfo.lat, data.countryInfo.lng])
          // setMapZoom(4)
       })
    }
    // console.log("Country info>>",countryInfo);

    return (
      <div className="App">
        
        <div className="app_left">
            <div className="app_header">
                <h1>COVID-19 TRACKER</h1>
                  <FormControl className="app_dropdown">
                    <Select variant="outlined" onChange={countryHandle} value={country}> 
                      <MenuItem value="worldwide">Worldwide</MenuItem>
                      {
                        countries.map(country => (
                          <MenuItem value={country.value} >{country.name}</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
            </div>

            <div className="app_status">
                <InfoBox title="Coronaviruse cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
                <InfoBox title="Recovers" cases={countryInfo.todayRecovered} total={countryInfo.recoverd}/>
                <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
            </div>
            <Map 
              center={mapCenter}
              zoom={mapZoom}
            />
        </div> 

        <Card className="app_right">
            <CardContent>
              <h3>Live cases by Country</h3>
              <TableData countries={tableData}></TableData>
              <h3>Worldwide new cases</h3>
              <LineGraph/>
            </CardContent>
        </Card>

      </div>
    );
  }

  export default App;
