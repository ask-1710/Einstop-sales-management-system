import http from "../http-common";

class SalesDataService {
  getAll(page = 0) {
    return http.get(`supply/sales?page=${page}`);
  }

  find(query, by = "location", page = 0) {
    return http.get(`supply/sales?${by}=${query}&page=${page}`);
  } 

  findAll(location="All", purchaseMethod="Any", couponUsed="", page=0) {

    var queryLocation = (location==="All"?null:location)
    var queryPurchaseMethod = (purchaseMethod==="Any"?null:purchaseMethod)
    var queryCoupons = (couponUsed===""?null:couponUsed)

    var query = `supply/sales?page=${page}`
    if(queryLocation) {
      query+=`&location=${queryLocation}`
    }
    if(queryPurchaseMethod) {
      query+=`&purchaseMethod=${queryPurchaseMethod}`
    }
    if(queryCoupons) {
      query+=`&couponUsed=${couponUsed}`
    }
    
    console.log(query)

    return http.get(query) ;

  }

  get(id) {
    return http.get(`supply/sale/${id}`);
  }

  createSale(data) {
    return http.post("supply/sale", data);
  }

  deleteSale(id) {
    return http.delete(`supply/sale/${id}`);
  }

  getPurchaseMethod() { 
    return http.get('supply/purchaseMethods') ;
  }

  getStoreLocations() {
    return http.get('supply/storeLocations') ;
  }

  getUnlimited(query, by, page=0) {
    if(!query) {
      return http.get(`supply/sales?SalesPerPage=1000`)
    }
    else{
      return http.get(`supply/sales?${by}=${query}&page=${page}&SalesPerPage=1000`)
    }
    
  } 

}

export default new SalesDataService();