import React, { useState } from 'react';
import SalesDataService from '../services/sales.js'
import { useEffect } from 'react';
import '../App.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Chart } from "react-google-charts";
import dayjs from 'dayjs' ;
import priceFormatter from '../services/priceFormatter.js'
import {Link, Route, Routes} from 'react-router-dom' ;
import Login from './login.js'


const SalesList = props => {
  const [sales, setSales] = React.useState([])
  const [queryLocation, setQueryLocation] = React.useState("")
  const [queryCoupons, setQueryCoupons] = React.useState()
  const [queryPurchaseMethod, setQueryPurchaseMethod] = React.useState("")
  const [purchaseMethods, setPurchaseMethods] = React.useState(["Any"]);
  const [pages, setQueryPage] = React.useState(0) 
  const [locations,  setLocations] = React.useState(["All"])
  const [startDate, setstartDate] = React.useState(new Date('1/2/2013'))
  const [endDate, setendDate] = React.useState(new Date('12/30/2017'))
  const [NoSalesFlag, setNoSalesFlag] = React.useState(false)
  const [modifiedSales, setModifiedSales] = React.useState(null)
  const [totalSales, settotalSales] = useState(0)
  const [revenue, setRevenue]=useState(0.0)
  const [minDate, setMinDate] = useState(new Date('1/2/2013'))
  const [maxDate, setMaxDate] = useState(new Date('12/30/2017'))
  const [trigger, setTrigger] = useState(false)
  
  useEffect(() => {
    retrieveSales();
    retrievePurchaseMethod();
    retrieveLocations();
  }, []);


  const onChangeQueryLocation = e => {
    const searchLocation = e.target.value;
    setQueryLocation(searchLocation);
  };

  const onChangeQueryCoupons = e => {
    const searchCoupons = (e.target.checked?true:false)
    setQueryCoupons(searchCoupons);
  };

  const onChangeQueryPurchaseMethod = e => {
    const searchPurchaseMethod = e.target.value;
    setQueryPurchaseMethod(searchPurchaseMethod);
  };

  const onChangeSetstartDate = e => {
    setstartDate(e)
  }

  const onChangeSetendDate = e => {
    setendDate(e)
  }

  const retrieveSales = () => {
    SalesDataService.getAll()
      .then(response => {
        setSales(response.data.Sales);
      })
      .catch(e => {
        console.log(e);
      });
      setNoSalesFlag(true)
  };

  const retrievePurchaseMethod = () => {
    SalesDataService.getPurchaseMethod()
      .then(response => {
        setPurchaseMethods(["Any"].concat(response.data));
        setNoSalesFlag(true)
      })
      .catch(e => {
        console.log(e);
      });
      
  };

  const retrieveLocations = () => {
    SalesDataService.getStoreLocations()
    .then(response => {
      setLocations(["All"].concat(response.data));
      setNoSalesFlag(true)
    })
    .catch(e => {
      console.log(e);
    });
  }

  const refreshList = () => {
    retrieveSales();
    setNoSalesFlag(true)
  };

  const find = (query, by) => {
    SalesDataService.find(query, by)
      .then(response => {
        
        setSales(response.data.Sales);

        modifySalesFormat() 
        setNoSalesFlag(true)
      })
      .catch(e => {
        console.log(e);
      });
  };

  const modifySalesFormat = () => {
    
    var modified = [['Location','Date (MM-DD-YYYY)','Customer','Rating','Purchase Method','Coupon used']]
    var total=0;
    var revenue=0
    sales.map(sale => {
      if(dayjs(sale.saleDate) > dayjs(startDate) && dayjs(sale.saleDate) < dayjs(endDate)) {
        var m = []
        m.push(sale.storeLocation)
        m.push(dayjs(sale.saleDate).format('MM-DD-YYYY'))
        m.push(sale.customer.email)
        m.push(sale.customer.satisfaction)
        m.push(sale.purchaseMethod)
        m.push(sale.couponUsed)
        modified.push(m) 
        sale.items.map(item=>{
          total+=(parseInt(item.quantity))
          revenue+=(parseInt(item.quantity)*item.price['$numberDecimal'])
        })
      }
    })

    modified.sort((a,b) => (dayjs(b[1]).toDate())-(dayjs(a[1]).toDate()))

    if(modified.length>1) {
      setModifiedSales(modified)
      settotalSales(total)
      setRevenue(revenue)
    }

  }

  const findAllFilters = () => {
    if(queryLocation === "Any") queryLocation = null
    if(queryPurchaseMethod === "All") queryPurchaseMethod = null
    SalesDataService.findAll(queryLocation, queryPurchaseMethod, queryCoupons)
    .then(response => {
      setSales(response.data.Sales)
      modifySalesFormat(sales)
    })
    .catch(e => {
        console.log(e)
    })
  }

  return (
      props.loggedIn ? ( 
      <div className='container wrapper App'>
      <div className='row py-3'>
        <div className="col-2">
        <div class="sticky-top">
        <div class="nav flex-column">     
          <div className="form-outline form-white">
              <select class="form-control selectinput" type="select" onChange={onChangeQueryPurchaseMethod}>
                {
                  purchaseMethods.map(method => {
                    return (
                      <option value={method}> {method} </option>
                    )
                  })
                }
              </select>
              <label class="form-label" for="formWhite1">Purchase Method</label>
          </div>
        <div className="form-outline form-white">
          <select class="form-control selectinput" type='select'  onChange={onChangeQueryLocation}>
              {
                locations.map(method => {
                  return (
                    <option value={method}> {method} </option>
                  )
                })
              }
            </select>
            <label class="form-label" for="formWhite2">Location</label>
            {/* <div className="input-group-append">
                <button className="btn btn-outline-dark" onClick={findByLocation}>Apply</button>
            </div> */}
        </div>
        <div className="form-outline form-white">
            <DatePicker
                className='form-control input'
								id="startDate"
								onChange={onChangeSetstartDate}
								selected={minDate}
                startDate={minDate}
                endDate={maxDate}
							/>
            <label class="form-label" for="formWhite3">From</label>
        </div>
        <div className="form-outline form-white">
            <DatePicker
                className='form-control input' 
								id="endDate"
								onChange={onChangeSetendDate}
								selected={maxDate}
                startDate={minDate}
                endDate={maxDate}
							/>
              <label class="form-label" for="formWhite4">To</label>
        </div>   
        <div class="custom-control custom-switch">
          <input type="checkbox"  class="regular-checkbox big-checkbox" onChange={onChangeQueryCoupons} id="customSwitch2" />
        </div>
        <label class="form-label" for="formWhite6">Coupons</label>
        <br/>
        <br/>
        <div className="input-group-append mb-3">
          <button
            className="btn btn-outline-dark"
            type="button"
            onClick={findAllFilters}
          >
            Apply All Filters
          </button>
        </div>
      </div>  
        <br/>
        <br/>
        <div className='row py-3'>
        <div className="col-12">
              <div className="card">
                <div className="card-body card-bg-dark ">
                  <h5 className="card-title card-bg-dark">STATS</h5>
                  <p className="card-text card-bg-dark">
                    <strong>Total Sales : </strong>{priceFormatter(totalSales)}<br/>
                    <strong>Revenue: </strong>{priceFormatter(Math.trunc(revenue))}<br/>
                  </p>
                </div>
              </div>
            </div>
      </div>
      </div> 
      </div>
      <div className='col-1'></div>
      <div className="col">
      { 
        NoSalesFlag && modifiedSales ?
        <Chart
            chartType="Table"
            width="100%"
            height="100%"
            data={modifiedSales}
            options={{     
              allowHtml: true,
              title: "Sales",
              legend: { position: "top" },
              pageSize: 25,
              width:"100%",
              height:"100%",
              cssClassNames: {
                'headerRow': 'font-color-white large-font bold-font black-background gold-border',
                'tableRow': 'light-coral-background font-color-black bold-font',
                'oddTableRow': 'orange-background font-color-black bold-font',
                'selectedTableRow': 'light-orange-background large-font',
                'hoverTableRow': 'light-orange-background large-font',
                'headerCell': 'gold-border',
                'tableCell': 'text-font right-text deeppink-border',
                'rowNumberCell': 'underline-blue-font',
                'footer':'black-background'
              }            
            }}
          /> :
          <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <h1 class="display-4">No Such Sales Exist :(</h1>
            <p class="lead">Try the following<br/>
              <li>Change the filters</li>
              <li>Click on <div className='text-italics'>Apply All Filters</div> two times if <div className='text-italics'>desired</div> results are not obtained</li>
              <li>Currently only sales dated between <div className='text-italics'>2013</div> and <div className="text-italics">2017</div> exist</li>
            </p>
          </div>
        </div>
      } 
      </div>
      </div>
    </div>
    ) :
    (<div>
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-4">Log In to continue</h1>
        <p class="lead">Head on to <Link to='/supply'>Login Page</Link></p>
      </div>
    </div>
     <div className="container mt-3">
     <Routes>
       <Route path="/supply" element={<Login login={props.login}/>}
       />
     </Routes>
     </div>
     </div>
    )
   
  );
}

export default SalesList;