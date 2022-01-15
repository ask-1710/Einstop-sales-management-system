import React, { useEffect, useState } from 'react';
import SalesDataService from '../../services/sales.js' ;
import dayjs from 'dayjs' ;
import { Chart } from "react-google-charts";
import {Link,Routes,Route} from 'react-router-dom';

const Graph2 = props => {

  const [sales, setSales] = React.useState([])
  const [dataForAnnualPie, setDataForAnnualPie] = useState(null)
  const [queryYear, setQueryYear] = useState(null)
  const [yearToDisplay, setYearToDisplay] = useState(null)
   
  const calculateTotalRevenue = (items) => {
    // console.log(items) ;
    var totalRevenue = 0.0
    items.map(item => {
      totalRevenue+=(parseInt(item.quantity)*item.price['$numberDecimal']) 
    })
    return totalRevenue
  }

  const DisplayPieForRevenueChart = () => {
    // as pie chart comparing all stores
    SalesDataService.getUnlimited()
    .then(response => {       
        setSales(response.data.Sales)
    })
    .catch(e => {
        console.log(e);
    })

    var m = [["Store","Annual Revenue"]]
    
    sales.map((sale)=>{
      const year = dayjs(sale.saleDate).year()
      if(year == queryYear) {
        const annualRevenue = calculateTotalRevenue(sale.items) 
        
        var flag = 0
        for(var i=1;i<m.length;i++) {
          if(m[i][0] === sale.storeLocation) {
            m[i][1]+=annualRevenue
            flag = 1
            break
          }
        }
        if(!flag) {
          m.push([sale.storeLocation, annualRevenue])
        }
      }
    })

    setDataForAnnualPie(m)
    setYearToDisplay(queryYear)
  }

  const OnChangeSetYear = e => {
    setQueryYear(e.target.value)
  }

    return (
      <div className='wrapper'>
        <div className="input-group mb-3 container">
                      <div class="input-group-prepend">
                          <span class="input-group-text bg-dark" id="basic-addon3"><div className='text-white'>Year</div></span>
                      </div>

                      <input class="form-control numerical-input" type="number" min="2013" max="2017" onChange={OnChangeSetYear} >
                      </input>

                      <div className="input-group-append">
                          <button
                          className="btn btn-outline-dark"
                          type="button"
                          onClick={DisplayPieForRevenueChart}
                          >
                          Analyze
                          </button>
                      </div>
        </div>
        <div className='container'>
          {
            dataForAnnualPie?(<div>
              <div class="jumbotron jumbotron-fluid">
              <div class="container">
                <h1 class="display-6">2. Comparison of Annual Sales in stores in {yearToDisplay}</h1>
              </div></div>
              <Chart
              width={'800px'}
              height={'600px'}
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={dataForAnnualPie}
              options={{
                title: `% Revenue per outlet in the year ${yearToDisplay}`,
                // chartArea: { left: 15, top: 15, right: 0, bottom: 0 },
                pieSliceText: "label",
              }}
              />
            </div>) :
            <div class="jumbotron jumbotron-fluid">
              <div class="container">
                <h1 class="display-6">2. Comparison of Annual Sales in stores</h1>
                <p class="lead text-italics">Select a year</p>
              </div>
            </div>
          }
        </div>
      </div>
        
    )
}

export default Graph2