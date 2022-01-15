import React, { useEffect , useState} from 'react';
import SalesDataService from '../../services/sales.js' ;
import dayjs from 'dayjs' ;
import { Chart } from "react-google-charts";


const Graph3 = props => {

  const [sales, setSales] = React.useState([])
  const [month, setMonth] = React.useState("")
  const [store, setStore] = React.useState("")
  const [dataForLineChart, setdataForLineChart] = React.useState(null)
  const [locations, setLocations] = React.useState([])
  const months = ['Jan', 'Feb','March','April','May','June','July','Aug','Sept','Oct','Nov','Dec'] 
  const [noData, setNoData] = useState(null)
  const [monthToDisplay, setMonthToDisplay]=useState('Jan')
  const [storeToDisplay, setStoreToDisplay]=useState('Austin')

  useEffect(() => {
    retrieveLocations();
  }, []);
  
  const calculateTotalRevenue = (items) => {
    // console.log(items) ;
    var totalRevenue = 0.0
    items.map(item => {
      totalRevenue+=(parseInt(item.quantity)*item.price['$numberDecimal']) 
    })
    return totalRevenue
  }

  const DisplayLineChart = () => {      
    // choose a month -> display line chart from that month      
    SalesDataService.getUnlimited(store, "location")
    .then(response => {        
        setSales(response.data.Sales)
    })
    .catch(e => {
        console.log(e);
    })

    var m = [["Date","Revenue"]]
    var monthlySaleExists = false 
    sales.map((sale)=>{
      const date = dayjs(sale.saleDate).month()
      if(date === month) {
        monthlySaleExists = true ;
        const d = dayjs(sale.saleDate).date()
        const monthlyRevenue = calculateTotalRevenue(sale.items) 
        
        var flag = 0
        for(var i=0;i<m.length;i++) {
          if(m[i][0] === d) {
            m[i][1]+=monthlyRevenue
            flag = 1
            break
          }
        }
        if(!flag) {
          m.push([d,monthlyRevenue])
        }
      }
    })
    if(!monthlySaleExists)
      setdataForLineChart(null)
    else {
      m.sort((a,b)=>a[0]-b[0])
      setdataForLineChart(m)
    }

    setStoreToDisplay(store)
    setMonthToDisplay(month)

  }

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
  // triggered setters
  const OnChangeSetStore = e => {
      setStore(e.target.value)
  }

  const OnChangeSetMonth = e => {
    console.log(e.target.value)
    for(var i=0;i<12;i++){
      if(months[i] === e.target.value) {
        setMonth(i) 
        return  
      }
    }
    return 
  }

    return (
        <div className='wrapper'>
            <div className="input-group mb-3 container">
                    <div class="input-group-prepend">
                        <span class="input-group-text bg-dark" id="basic-addon1"><div className='text-white'>Store Location</div></span>
                    </div>
                    <select class="form-control selectinput" type='select' onChange={OnChangeSetStore}>
                    {
                        locations.map(method => {
                            return (
                            <option value={method}> {method} </option>
                            )
                        })
                    }
                    </select>
            </div>
            <div className="input-group mb-3 container">
                <div class="input-group-prepend">
                    <span class="input-group-text bg-dark" id="basic-addon4"><div className='text-white'>Month</div></span>
                </div>

                <select class="form-control selectinput" type='select' onChange={OnChangeSetMonth}>
                    {
                    months.map(method => {
                        return (
                        <option value={method}> {method} </option>
                        )
                    })
                    }
                </select>

                <div className="input-group-append">
                    <button
                    className="btn btn-outline-dark"
                    type="button"
                    onClick={DisplayLineChart}
                    >
                    Analyze
                    </button>
                </div>
            </div>
            <div className='row py-4'></div>
            <div className='container'>
            {
            dataForLineChart!=null ?(
              <div>
              <div class="jumbotron jumbotron-fluid">
              <div class="container">
                  <h1 class="display-6">3. Monthly Revenue Chart for A store</h1> </div></div>  
                  <Chart
                  chartType="LineChart"
                  width="100%"
                  height="400px"
                  data={dataForLineChart}
                  options={{
                      title: `Revenue in ${storeToDisplay} in the month of ${months[monthToDisplay]}`,
                      legend: { position: "bottom" },
                      hAxis: {format: '0',
                              viewWindow: {
                                min: 0,
                                max: 31
                              }
                            }
                  }}
                  /> 
              </div>
            ):
             noData ? (
              <div class="jumbotron jumbotron-fluid">
              <div class="container">
                  <h1 class="display-6">3. Monthly Revenue Chart for A store</h1>
                  <p class="lead text-italics">Select a Store and a Month</p>
              </div>
              </div> 
              ) : (
                <div class="jumbotron jumbotron-fluid">
                <div class="container">
                    <h1 class="display-6">3. Monthly Revenue Chart for A store</h1>
                    <p class="lead text-italics">No data found :(</p>
                </div>
                </div> 
              )
            }
            </div>
        </div>
    )
}

export default Graph3