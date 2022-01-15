import React, { useEffect , useState } from 'react';
import SalesDataService from '../../services/sales.js' ;
import dayjs from 'dayjs' ;
import { Chart } from "react-google-charts";
import {Link,Routes,Route} from 'react-router-dom';

const Graph1 = props => {

  const [sales, setSales] = React.useState([])
  const [dataForPiePlot, setdataForPiePlot] = useState(null)
  const [store, setStore] = useState('Austin')
  const [locations, setLocations] = React.useState([])
  const [noData, setNoData] = React.useState(false)
  const [storeToDisplay, setStoreToDisplay] = useState('Austin')

    useEffect(() => {
      retrieveLocations();
    }, []);
    
    const retrieveLocations = () => {
        SalesDataService.getStoreLocations()
        .then(response => {
        // console.log(response.data);
        setLocations(response.data);
        })
        .catch(e => {
        console.log(e);
        });
    }

    const calculateQuantityItems = () => {
               
        var items = {}
        
        sales.map(element => {

            element.items.map(item => {
              
              items[item.name]=(items[item.name] ? items[item.name]+parseInt(item.quantity) : parseInt(item.quantity))

            })
        });

        var ratios = [['Category','Quantity sold']]
        var objectKeysArray = Object.keys(items)
        objectKeysArray.forEach((objKey) => {
            var objValue = items[objKey]
            // objVal holds quantity of each item
            var ration = [objKey, objValue]
            ratios.push(ration)
        })
        
        return ratios
    }

    const DisplayPieChart = () => {
        SalesDataService.find(store, "location")
        .then(response => {       
            setSales(response.data.Sales) 
            setNoData(false);     
        })
        .catch(e => {
            setNoData(true);
            console.log(e);
        })
        const series = calculateQuantityItems()
        setdataForPiePlot(series)
        setStoreToDisplay(store)             
    }

    const OnChangeSetStore = e => {
        setStore(e.target.value)
    }

    return (
        <div className='wrapper'>
            <div className="input-group container">
            {/* <label class="input-group-prepend black-border centre col-1" for="formWhite2">Location</label> */}
            <select class="form-control selectinput centre" type='select'  onChange={OnChangeSetStore}>
                {
                  locations.map(method => {
                    return (
                      <option value={method}> {method} </option>
                    )
                  })
                }
              </select>
              <button className="input-group-addon btn btn-outline-dark" onClick={DisplayPieChart}>Analyse</button>          
          </div>
        <div className='row py-4'></div>
        <div>
        {
          dataForPiePlot?(
          <div className='container'>
              <div class="jumbotron jumbotron-fluid">
              <div class="container">
                <h1 class="display-6">Sales % Of Items in {storeToDisplay}</h1>
              </div>
            </div>
            <Chart
              className='centre-chart'
                width={'800px'}
                height={'600px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={dataForPiePlot}
                options={{
                  title: `Percentage of items Sold in ${storeToDisplay}`,
                  pieSliceText: "label"
                }}
              />
            </div> ) : (
            noData? <div>No Data yet</div> :
            <div class="jumbotron jumbotron-fluid centre-text">
              <div class="container">
                <h1 class="display-6">Sales % Of Items in A store</h1>
                <p class="lead text-italics">Select a store</p>
              </div>
            </div>
            )
        }
        </div>
      </div>
    )
}

export default Graph1