import './App.css';
import React from 'react';
import { Route, Routes, Link  } from 'react-router-dom' ;
import "bootstrap/dist/css/bootstrap.min.css" ;
import  SalesList  from './components/sales-list.js';
import  Login  from './components/login.js';
import AnalyzeSales from './components/analyze.js';
import ManagementTools from './components/management.component';
import Graph1 from './components/graphs/graph1.component';
import Graph2 from './components/graphs/graph2.component';
import Graph3 from './components/graphs/graph3.component';

function App() {

  const [user, setUser] = React.useState(null)
  const [state, setState] = React.useState(false)
    
  async function login(user) {
    setUser(user)
    setState(true)
  }

  async function logout() {
    setUser(null);
    setState(false)
  }

  return (
      <div className="App">

        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/supply" className="navbar-brand">
            EinStop
          </a>
          <div className="navbar-nav ml-auto pull-right">
            {
              user ? 
                  <Link to="/supply/sales">
                    <li class="nav-item">
                      <a className="nav-link" >Monitor Sales</a>
                    </li>
                  </Link> 
              :
              null
            }
            
            {
              user ? 
                  <Link to="/supply/analyze">
                      <li class="nav-item">
                        <a className="nav-link" >Analyze Sales</a>
                      </li>
                  </Link>
                  :
                  null
            }

            {
              user ? 
                  <Link to="/supply/tools">
                      <li class="nav-item">
                        <a className="nav-link" >Management Tools</a>
                      </li>
                  </Link>
                  :
                  null
            }
            
                        
            { 
              user ? (
              <li className="nav-item" >
                <Link to="/">
                  <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                    Logout {user.name}
                  </a>
                </Link>
              </li>
                ) : (           
              <Link to="/supply">
                  <li className="nav-item" >
                    <a className="nav-link">Login</a>
                  </li>
              </Link>
              )
            }
            
           {
           user?
           null
          :
          <div className='text-gray'>
          Username:admin <br/>
          Password:001    
        </div>
          }
          </div>
        </nav> 

        <div className="container mt-3">
          <Routes>

            <Route path="/supply" element={<Login login={login}/>}
            />
              
            <Route path="/supply/sales" element={<SalesList loggedIn={state} login={login}/>}/>
                          
            <Route 
              path='/supply/analyze'
              element={<AnalyzeSales loggedIn={state} login={login}/>}
            />

            <Route
              path='/supply/tools'
              element={<ManagementTools loggedIn={state} login={login}/>}
            />

          <Route path='/analyze/graph1' element={<Graph1/>}
          />
          <Route path='/analyze/graph2' element={<Graph2 />} 
          />
          <Route path='/analyze/graph3' element={<Graph3 />}
          />


          </Routes> 
        </div> 
      
    </div>
  );
}

export default App;
