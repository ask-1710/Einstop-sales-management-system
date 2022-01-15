// import React, { useEffect } from 'react';
// import SalesDataService from '../../services/sales.js' ;
// import dayjs from 'dayjs' ;
// import { Chart } from "react-google-charts";
// import {Link,Routes,Route} from 'react-router-dom';

// const Graph4 = props => {   
  
//   const [dataForBarChart, setdataForBarChart] = React.useState(null)
//   const [sales, setSales] = React.useState([])
//   const [month, setMonth] = React.useState("")
//   const months = ['Jan', 'Feb','March','April','May','June','July','August','September','October','November','December'] 
//   const [queryItem, setItem] = React.useState('')
//   const [queryYear, setQueryYear] = React.useState()
//   const [dataForAnnualPie, setDataForAnnualPie] = React.useState(null)

//   const OnChangeSetYear = e => {
//     setQueryYear(e.target.value)
//   }
   
//   const calculateTotalRevenue = (items) => {
//     // console.log(items) ;
//     var totalRevenue = 0.0
//     items.map(item => {
//       totalRevenue+=(parseInt(item.quantity)*item.price['$numberDecimal']) 
//     })
//     return totalRevenue
//   }


//   const DisplayPieForRevenueChart = () => {
//     // as pie chart comparing all stores
//     SalesDataService.getUnlimited()
//     .then(response => {       
//         setSales(response.data.Sales)
//     })
//     .catch(e => {
//         console.log(e);
//     })

//     var m = [["Store","Annual Revenue"]]
    
//     sales.map((sale)=>{
//       const year = dayjs(sale.saleDate).year()
//       if(year == queryYear) {
//         const annualRevenue = calculateTotalRevenue(sale.items) 
        
//         var flag = 0
//         for(var i=1;i<m.length;i++) {
//           if(m[i][0] === sale.storeLocation) {
//             m[i][1]+=annualRevenue
//             flag = 1
//             break
//           }
//         }
//         if(!flag) {
//           m.push([sale.storeLocation, annualRevenue])
//         }
//       }
//     })

//     setDataForAnnualPie(m)
//   }


//     return (
//       <div className='wrapper App container'>
          
//         <div>
//             {
//               props.dataForBarChart!=null?( <div>
//                 <div class="jumbotron jumbotron-fluid">
//                 <div class="container">
//                 <h1 class="display-6">4. Comparison of product demand in stores</h1>
//                 </div></div>                
//                 <Chart
//                   chartType="BarChart"
//                   width="100%"
//                   height="400px"
//                   data={dataForBarChart}
//                   options={{
//                     title: `Demand for ${queryItem}`,
//                     curveType: "function",
//                     legend: { position: "bottom" } ,
//                     hAxis: {
//                       title: `Total Sales of ${queryItem}`,
//                       minValue: 0,
//                     },
//                     vAxis: {
//                       title: "City",
//                     },
//                   }}
//                 /> 
//                 </div>) :
//                 <div class="jumbotron jumbotron-fluid">
//                   <div class="container">
//                     <h1 class="display-6">4. Comparison of product demand in stores</h1>
//                     <p class="lead text-italics">Enter an Item</p>
//                   </div>
//                 </div>
//             }
//         </div>
//       </div>
        
//     )
// }

// export default Graph4