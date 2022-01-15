import dayjs from 'dayjs';
import SalesDAO from './dao/SalesDAO';

const sales ;

async function getData() {
    const salesDataResponse = await (await SalesDAO.getSales(SalesPerPage=1000)).SalesList;
    return salesDataResponse;
}

async function revperday(sale) {
    var tsales=0.0

    sale.items.map(item => {
        tsales+=(parseInt(item.qty));
    });

    return tsales ;
}

async function calcRevenue(month, year) {
    sales.map(sale => {
        if(dayjs(sale.saleDate).month() === month && dayjs(sale.saleDate).year() === year) {
            totAmt+=revperday(sale);
        }
    })

}

async function cleanData() {
    
    sales=await getData()

    let arr ;
    var n = 0;
    
    await sales.map(sale => {
        var month = dayjs(sale.saleDate).date()
        arr.push({date: month, revenue:23424});
        // var flag = 0;
        // for(var i=0;i<n;i++) {
        //     if(arr[i].month===month && arr[i].year===year) {
        //         flag = 1;
        //         break ;
        //     }
        // }
        // if(!flag) {
        //     var newdata= {
        //         month: month,
        //         year: year,
        //         revenue: calcRevenue(month, year) 
        //     }
        //     if(newdata.revenue && newdata.month && newdata.year)
        //         arr.push(newdata);
        //     else
        //         console.log('null');
        // }
        break;
    })

    console.log(arr);

    return arr;

}

async function run() {
    // Load and plot the original input data that we are going to train on.
    const data = await cleanData();
    const values = data.map(d => ({
      date: d.date,
      label: d.revenue,
    }));
    console.log(values) ;

    return values;
    
}

export default run();