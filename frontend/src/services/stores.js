import http from "../http-common";

class StoresDataService {
  getStores() {
    return http.get('stores');
  }
}

export default new StoresDataService();