import React from 'react';
import Login from './login.js';
import {Link,Routes,Route} from 'react-router-dom';
import Graph1 from './graphs/graph1.component.js';
import Graph2 from './graphs/graph2.component.js';
import Graph3 from './graphs/graph3.component.js';
// import Graph4 from './graphs/graph4.component.js';

const AnalyzeSales = (props) => {
    
    return (
      <div>
      <div className='row'></div>
      <div className='row py-5'> {
      props.loggedIn ? (
          <div class="container">
              <div className="card card-height">
                <div className="card-body card-bg-dark ">
                  <h5 className="card-title card-bg-dark"><div className='italic-orange-font bold-font'>GRAPHS</div></h5>
                  <p className="card-text card-bg-dark">
                  <Link to = '/analyze/graph1'>
                  <div className='italic-orange-font bold-font'>1. Sales % Of Items in A store</div>
                  </Link><br/>
                  <Link to = '/analyze/graph2'>
                     <div className='italic-orange-font bold-font'>2. Comparison of Annual Sales in stores</div>
                  </Link><br/>
                  <Link to = '/analyze/graph3'>
                   <div className='italic-orange-font bold-font'>3. Monthly Revenue Chart for A store</div>
                  </Link><br/>
                  {/* <Link to = '/analyze/graph4'>
                  4. Comparison of product demand in stores
                  </Link> */}  
                  </p>
                </div>
             </div>
          </div>
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
      <div className="container mt-3">
        <Routes>
          <Route path="/supply" element={<Login login={props.login}/>}
          />
          <Route path='/analyze/graph1' element={<Graph1/>}
          />
          <Route path='/analyze/graph2' element={<Graph2 />} 
          />
          <Route path='/analyze/graph3' element={<Graph3 />}
          />
          {/* <Route path='/analyze/graph4' element={<Graph4 dataForBarChart={dataForBarChart}/>}
          /> */}
        </Routes>
      </div>
      </div>
      </div>
    );
}

export default AnalyzeSales;