import React, { useState } from "react";
import '../App.css' ;
import {Routes,Route,Link} from 'react-router-dom' ;
import AnalyzeSales from "./analyze.js";
import SalesList from "./sales-list.js"

const Login = props => {

  const trueCredentials = {name: 'admin', id:'001'}

  const initialUserState = {
    name: "",
    id: "",
  };

  const [user, setUser] = useState(initialUserState);
  const [start, setStart] = useState(true);
  const [status, setStatus] = useState(true);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const login = () => {
    setStart(false)
    if(user.name === trueCredentials.name && user.id === trueCredentials.id) {
      setStatus(true)
      props.login(user)
      props.history.push('/')
    }
    else {
      setStatus(false)
    }
  }

  return (
    <div>
    <div className="container">
    <div className='row py-5'></div>
      {
        !start?
        (
          status?
          (
            <div class="jumbotron jumbotron-fluid">
              <div class="container">
                <h1 class="display-4">Welcome to EinStop's Sales Mangement System</h1>
                <p class="lead">We are as curious as you to see your sales booming!!<br/>To start with, navigate to <Link to='/supply/sales'><div className='italic-dark-font font-size bold-font'>monitor</div></Link>, <Link to='/supply/analyze'><div className="italic-dark-font font-size bold-font">analyze</div></Link> sales or <Link to='/supply/tools'><div className='italic-dark-font font-size bold-font'>smart-management tools</div></Link></p>
              </div>
            </div>
          )
          : 
          ( 
          <div className="container">
             <div className="row">
              <div className="col-lg-4 pb-1"></div>
              <div className="col-lg-4 pb-1">
              <div className="alert alert-danger" role="alert">
                Invalid Credentials - Please try again 
              </div>
            </div>
            </div>
            <div className="row">
                <div className="col-lg-4 pb-1"></div>
                <div className="col-lg-4 pb-1">
                    <div className="card bg-dark text-white">
                      <div className="card-body p-5 text-centre">
                        <div class="mb-md-5 mt-md-4 pb-5">
                          <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                          <p class="text-white-50 mb-5">Please enter your login and password</p>
                          <div class="form-outline form-white mb-4">
                            <input type="text" class="form-control form-control-lg" value={user.name} onChange={handleInputChange} title="login" name="name"/>
                            <label class="form-label text-white" >Username</label>
                          </div>
                          <div class="form-outline form-white mb-4">
                            <input type="password" id="typePasswordX" class="form-control form-control-lg" value={user.id} onChange={handleInputChange} name="id" required title='001'/>
                            <label class="form-label text-white" for="typePasswordX">Password</label>
                          </div>
                          <button class="btn btn-outline-light btn-lg px-5 addmore"  title="For Demo: UserName=admin,Password=001" onClick={login} >Login</button>
                        </div>
                      </div>            
                    </div>
                  </div>
            </div>
          </div>
          )
        )
        :
        <div className="row">
        <div className="col-lg-4 pb-1"></div>
        <div className="col-lg-4 pb-1">
            <div className="card bg-dark text-white">
              <div className="card-body p-5 text-centre">
                <div class="mb-md-5 mt-md-4 pb-5">
                  <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                  <p class="text-white-50 mb-5">Please enter your login and password</p>
                  <div class="form-outline form-white mb-4">
                    <input type="text" class="form-control form-control-lg" value={user.name} onChange={handleInputChange} required name="name"/>
                    <label class="form-label text-white" >Username</label>
                  </div>
                  <div class="form-outline form-white mb-4">
                    <input type="password" id="typePasswordX" class="form-control form-control-lg" value={user.id} onChange={handleInputChange} name="id" required/>
                    <label class="form-label text-white" for="typePasswordX">Password</label>
                  </div>
                  <button class="btn btn-outline-light btn-lg px-5"  type="submit" onClick={login}>Login</button>
                </div>
                  </div>            
                </div>
              </div>
        </div>
      }
      </div>
    <div className="container mb-3">
      <Routes>
          <Route path="/supply/sales" element={<SalesList loggedIn={status} login={props.login}/>}/>
          <Route 
              path='/supply/analyze'
              element={<AnalyzeSales loggedIn={status} login={props.login}/>}
            />
      </Routes>
    </div>
    </div>
  );
};

export default Login;


/*

       <div className="submit-form">
          <div>
            <div className="form-group">
              <label htmlFor="user">Username</label>
              <input
                type="text"
                className="form-control"
                id="name"
                required
                value={user.name}
                onChange={handleInputChange}
                name="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input
                type="text"
                className="form-control"
                id="id"
                required
                value={user.id}
                onChange={handleInputChange}
                name="id"
              />
            </div>

            <button onClick={login} className="btn btn-success">
              Login
            </button>
          </div>
        </div> 
      
  
*/