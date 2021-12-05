export class CustomerService {
  getCustomersMedium() {
    return fetch("./customers-medium.json")
      .then((res) => res.json())
      .then((d) => d.data);
  }

  getCustomersLarge() {
    return fetch("./customers-large.json")
      .then((res) => res.json())
      .then((d) => d.data);
  }

  getCustomersXLarge() {
    return fetch("./customers-xlarge.json")
      .then((res) => res.json())
      .then((d) => d.data);
  }

  getCustomers(params) {
    const queryParams = Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
    return fetch(
      "https://www.primefaces.org/data/customers?" + queryParams
    ).then((res) => res.json());
  }
}
