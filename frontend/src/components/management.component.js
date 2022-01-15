import React, { useEffect, useState } from 'react';
import {Link,Routes,Route} from 'react-router-dom';
import StoresDataService from '../services/stores.js' ;
import SalesDataService from '../services/sales.js' ;
import priceFormatter from '../services/priceFormatter.js';
import DatePicker from 'react-datepicker';
import Box from '@mui/material/Box';
import dayjs from 'dayjs'
import Popper from '@mui/material/Popper';

const ManagementTools = (props) => {
    const [stores, setStores] = useState([])    
    const [numStores, setNumStores] = useState(0)
    const [currStore, setCurrStore] = useState(0)
    const [revenue, setRevenue] = useState([])
    const [saved, setSaved] = useState()
    const [details, setDetails] = useState([])
    const [displayDetails, setDisplayDetails] = useState(null)
    const [ranks, setRanks] = useState([])
    const [stats, setStats] = useState([])
    const [rote, setROTE] = useState()
    const [spa, setspa] = useState()
    const [surpriseVisit, setSurpriseVisit] = useState(false)
    const [minDate, setMinDate] = useState(new Date())
    const [maxDate, setMaxDate] = useState(new Date()+7)
    const [DOV, setDOV] = useState(new Date())
    const [visit, setVisit]=useState(false) 
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [mailSent, setMailSent] = useState(false)
    
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;
  
  useEffect(() => {
    retrieveLocations()
    retrieveSales()    
  }, [saved]); 

  const reload = () => {
    setSaved(false);
  }
 
  const retrieveSales = () => {
    if(stores.length>0) {
      var listRevenue = []
      var listStores = []
      var stats = []
      stores.forEach(loc=>{
        SalesDataService.find(loc,"location")
          .then(res=>{
            const sales = res.data.Sales
            var revenuel=0.0
            sales.forEach(sale=>{
              sale.items.forEach(item=>{
                revenuel+=(parseInt(item.quantity)*item.price['$numberDecimal'])
              })
            })
            
            if(listRevenue.length===0) {
              listRevenue = [revenuel]
              listStores = [loc]
            }
            else {
              listStores.splice(listRevenue.length, 0, loc)
              listRevenue.splice(listRevenue.length, 0, revenuel)
            }

            details.forEach(det=>{
              if(det.location===loc) {
                  const sales = listRevenue.at(-1)
                  // const rent = det.rent['$numberDecimal']
                  const staff = parseInt(det.numStaff)
                  const area = parseInt(det.area)

                  const ROTE = sales/staff 
                  const salespa = sales/area

                  // const val = ROTE+salespa-(rent*area)
                  
                  stats.push({'location':loc,'rote':ROTE,'salesByarea':salespa})

                  if(loc===stores[currStore]) {
                    setDisplayDetails(det)
                  }
                }
            })


            if(listRevenue.length === numStores) {
              setStores(listStores)
              setRevenue(listRevenue)
              setStats(stats)
              retrieveDetails(listStores[currStore])
            }

          })
          .catch(e=>{console.log(e.message);})


      }) 
    }
  }

  const retrieveLocations = () => {
    StoresDataService.getStores()
      .then(res=>{
        const data = res.data.Stores
        const names=data.map(store=>{
          return store.location
        })
        setDetails(data)
        setStores(names)
        setNumStores(res.data.Stores.length)  
        reload()
      })
      .catch(e=>{console.log(e.message)})
  }

  const nextStore = e => {
    const next = (currStore+1)%numStores
    setCurrStore(next)
    retrieveDetails(stores[next])
    setVisit(false)
    setSurpriseVisit(false)
    setDOV(new Date())
  }

  const prevStore = e => {
    const prev = (currStore>0?(currStore-1):(numStores-1))
    setCurrStore(prev)
    retrieveDetails(stores[prev])
    setVisit(false)
    setSurpriseVisit(false)
    setDOV(new Date())
  }

  const retrieveDetails = (loc) => {
    stats.forEach(s=>{
      if(s.location===loc) {
        setROTE(s.rote)
        setspa(s.salesByarea)
      }
    })
    details.forEach(det=>{
      if(det.location===loc) {
        setDisplayDetails(det)
      }
    })
  }

  const OnChangeSetSurpriseVisit = e => {
    const state = (e.target.checked?true:false);
    setSurpriseVisit(state)
  } 

  const OnChangeSetDOV = e => {
    setDOV(e)
    console.log(e)
  }

  const onClickSetVisit = () => {
    setVisit(true)
  }

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  const onSubmit = () => {
    setMailSent(true)
  }

  const formatDate = (date) => {
    const newDate=dayjs(date.toJSON())
    return dayjs(newDate).format('DD-MMM-YYYY , HH:mm')
  }

    return (
      <div>
      <div className='row'></div>
      <div className='row py-5'>
      {
        props.loggedIn ? (
          <div> {
            stores ? (
            <div class="wrapper">
            <div className='row py-5'>
              <div className='col-2'></div>  
              <div className='col-1'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16" onClick={prevStore}>
                  <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                </svg>
              </div>
              <div className='col-6'>
                <div className='text-centre'>
                  {
                  revenue.length>0 && displayDetails!=null?                
                    (<div>
                      <h1>{stores[currStore]}</h1>

                      <div className='row'>
                        <div className="col-lg-6 pb-4 py-5">
                          <div className="card bg-dark text-white">
                            <div className="card-body p-4 text-centre">
                              <div class="mb-md-4 mt-md-4 pb-4">
                                <h2 class="fw-bold mb-2 text-uppercase">STATS</h2>
                                <div class="form-outline form-white mb-8 text-left-align medium-font">
                                    <p>
                                      <strong>Revenue : $</strong>{' '+priceFormatter(parseInt(revenue[currStore]))+'\n'}<br/>
                                      <strong>In staff : </strong>{' '+parseInt(displayDetails.numStaff)+'\n'}<br/>
                                      <strong>ROTE ($/staff) :</strong> {' '+priceFormatter(parseInt(rote))+'\n'}<br/>
                                      <strong>Sales/area($/sqft) :</strong>{' '+priceFormatter(parseInt(spa))+'\n'}<br/>
                                    </p>
                                </div>
                              </div>
                            </div>            
                          </div>
                        </div>
                        <div className="col-lg-6 pb-4 py-5">
                          <div className="card bg-dark text-white">
                            <div className="card-body p-4 text-centre">
                              <div class="mb-md-4 mt-md-4 pb-4">
                                <h2 class="fw-bold mb-2 text-uppercase">MANAGER</h2>
                                <div class="form-outline form-white mb-6 text-left-align medium-font">
                                    <p>
                                    <strong>Name : </strong>{' '+(displayDetails.manager.name)+'\n'} <br/>
                                    <strong>Age : </strong>{' '+(displayDetails.manager.age)+'\n'} <br/>
                                    <strong>Contact No. : </strong>{' '+(displayDetails.manager.mobile)+'\n'} <br/>
                                    <strong>Cadre : </strong>{' '+(displayDetails.manager.cadre)+'\n'} <br/>
                                    </p>
                                </div>
                              </div>
                            </div>            
                          </div>
                        </div>
                      </div>
                      <div className='input-group'>
                      <label  for='btn'>Do you want to stop by this store anytime this week ?</label>
                      <button type="button" id='btn' class="btn btn-outline-dark inline" onClick={onClickSetVisit}>Yes</button>  
                      </div>
                      <div>
                      {
                      visit? (
                        <div className='text-left-align'>
                            <div className='input-group'>
                              <label>Do you want to make it an uninformed visit ?</label>
                              <input type="checkbox" id='chekky' class="regular-checkbox big-checkbox" onChange={OnChangeSetSurpriseVisit} />
                              <div className='col-1'></div>
                              <button aria-describedby={id} className="btn btn-outline-dark button-right-align" for='chekky' onClick={handleClick}>
                                  To know more
                                </button>
                                <Popper id={id} open={open} anchorEl={anchorEl}>
                                  <Box sx={{ border: 1, p: 1, bgcolor: 'black' , color: 'whitesmoke' }}>
                                    In case of an informed visit (default), the manager of the store will be alerted by mail about your visit. If this box for surprise visit is checked, the mail to the manager will not be generated 
                                  </Box>
                                </Popper>
                              </div>
                            <div className='input-group'> 
                              <label for='dov'>Select a day this week</label>                        
                              <DatePicker
                              id='dov'
                                onChange={OnChangeSetDOV}
                                selected={DOV}
                                startDate={minDate}
                                endDate={maxDate}
                                showTimeSelect
                                className='input'
                              /> 
                              <button className="btn btn-outline-dark button-right-align" onClick={onSubmit}>
                                Confirm
                              </button>
                            </div>
                            <div>
                            {
                            mailSent ? (
                              <div> 
                                <div className='bold-green-font'>
                                Your next visit to {stores[currStore]} will be on {formatDate(DOV)}
                                </div>
                                {
                                  surpriseVisit?null:
                                    <div className='bold-green-font'>
                                      System generated mail sent to the store manager
                                    </div>
                                }
                              </div>
                            ):null
                            }
                          </div>
                        </div>
                    ):null
                  }
                      </div>
                  </div>):null}
                  </div>
              </div>
              <div className='col'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16" onClick={nextStore}>
                  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                </svg>
              </div>
            </div>
          </div>
          ):
          (<div>Not yet Loaded</div>)    
        }</div>    
       ) :
       (
       <div class="jumbotron jumbotron-fluid">
         <div class="container">
           <h1 class="display-4">Log In to continue</h1>
           <p class="lead">Head on to <Link to='/supply'>Login Page</Link></p>
         </div>
       </div>
       )
      }
      </div>
      </div>
    
      );
}

export default ManagementTools;