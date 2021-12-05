import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { CustomerService } from "./CustomerService.js";
import "./DataTableDemo.css";
import HeaderTile from "../../Morecules/HeaderTile";

function RegCus() {
  const [customers, setCustomers] = useState([
    {
      id: 1000,
      name: "James Butt",
      country: {
        name: "Algeria",
        code: "dz",
      },
      company: "Benton, John B Jr",
      date: "2015-09-13",
      status: "unqualified",
      verified: true,
      activity: 17,
      representative: {
        name: "Ioni Bowcher",
        image: "ionibowcher.png",
      },
      balance: 70663,
    },
    {
      id: 1001,
      name: "Josephine Darakjy",
      country: {
        name: "Egypt",
        code: "eg",
      },
      company: "Chanay, Jeffrey A Esq",
      date: "2019-02-09",
      status: "proposal",
      verified: true,
      activity: 0,
      representative: {
        name: "Amy Elsner",
        image: "amyelsner.png",
      },
      balance: 82429,
    },
    {
      id: 1002,
      name: "Art Venere",
      country: {
        name: "Panama",
        code: "pa",
      },
      company: "Chemel, James L Cpa",
      date: "2017-05-13",
      status: "qualified",
      verified: false,
      activity: 63,
      representative: {
        name: "Asiya Javayant",
        image: "asiyajavayant.png",
      },
      balance: 28334,
    },
    {
      id: 1003,
      name: "Lenna Paprocki",
      country: {
        name: "Slovenia",
        code: "si",
      },
      company: "Feltz Printing Service",
      date: "2020-09-15",
      status: "new",
      verified: false,
      activity: 37,
      representative: {
        name: "Xuxue Feng",
        image: "xuxuefeng.png",
      },
      balance: 88521,
    },
    {
      id: 1004,
      name: "Donette Foller",
      country: {
        name: "South Africa",
        code: "za",
      },
      company: "Printing Dimensions",
      date: "2016-05-20",
      status: "proposal",
      verified: true,
      activity: 33,
      representative: {
        name: "Asiya Javayant",
        image: "asiyajavayant.png",
      },
      balance: 93905,
    },
    {
      id: 1005,
      name: "Simona Morasca",
      country: {
        name: "Egypt",
        code: "eg",
      },
      company: "Chapman, Ross E Esq",
      date: "2018-02-16",
      status: "qualified",
      verified: false,
      activity: 68,
      representative: {
        name: "Ivan Magalhaes",
        image: "ivanmagalhaes.png",
      },
      balance: 50041,
    },
    {
      id: 1006,
      name: "Mitsue Tollner",
      country: {
        name: "Paraguay",
        code: "py",
      },
      company: "Morlong Associates",
      date: "2018-02-19",
      status: "renewal",
      verified: true,
      activity: 54,
      representative: {
        name: "Ivan Magalhaes",
        image: "ivanmagalhaes.png",
      },
      balance: 58706,
    },
    {
      id: 1007,
      name: "Leota Dilliard",
      country: {
        name: "Serbia",
        code: "rs",
      },
      company: "Commercial Press",
      date: "2019-08-13",
      status: "renewal",
      verified: true,
      activity: 69,
      representative: {
        name: "Onyama Limba",
        image: "onyamalimba.png",
      },
      balance: 26640,
    },
  ]);
  const [expandedRows, setExpandedRows] = useState([]);
  const toast = useRef(null);
  const customerService = new CustomerService();

  useEffect(() => {
    customerService.getCustomersMedium().then((data) => setCustomers(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const headerTemplate = (data) => {
    return (
      <React.Fragment>
        <span className="image-text">{data.representative.name}</span>
      </React.Fragment>
    );
  };

  const footerTemplate = (data) => {
    return (
      <React.Fragment>
        <td colSpan="4" style={{ textAlign: "right" }}>
          Total Customers
        </td>
        <td>{calculateCustomerTotal(data.representative.name)}</td>
      </React.Fragment>
    );
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <img
          alt={rowData.country.name}
          src="showcase/demo/images/flag_placeholder.png"
          onError={(e) =>
            (e.target.src =
              "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
          }
          className={`flag flag-${rowData.country.code}`}
          width="30"
        />
        <span className="image-text">{rowData.country.name}</span>
      </React.Fragment>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span className={`customer-badge status-${rowData.status}`}>
        {rowData.status}
      </span>
    );
  };

  const representativeBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <img
          alt={rowData.representative.name}
          src={`showcase/demo/images/avatar/${rowData.representative.image}`}
          onError={(e) =>
            (e.target.src =
              "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
          }
          width="32"
          style={{ verticalAlign: "middle" }}
        />
        <span className="image-text">{rowData.representative.name}</span>
      </React.Fragment>
    );
  };

  const onRowGroupExpand = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Row Group Expanded",
      detail: "Value: " + event.data.representative.name,
      life: 3000,
    });
  };

  const onRowGroupCollapse = (event) => {
    toast.current.show({
      severity: "success",
      summary: "Row Group Collapsed",
      detail: "Value: " + event.data.representative.name,
      life: 3000,
    });
  };

  const calculateCustomerTotal = (name) => {
    let total = 0;

    if (customers) {
      for (let customer of customers) {
        if (customer.representative.name === name) {
          total++;
        }
      }
    }

    return total;
  };
  return (
    <div id="landing" className="section section__container">
      <HeaderTile tileTitle="Register Customer" tileName="cutsomer" />
      <h1>Register Customer testing</h1>
      <div className="datatable-rowgroup-demo">
        <Toast ref={toast}></Toast>

        <div className="card">
          <h5>RowSpan Grouping</h5>
          <DataTable
            value={customers}
            rowGroupMode="rowspan"
            groupRowsBy="representative.name"
            sortMode="single"
            sortField="representative.name"
            sortOrder={1}
            responsiveLayout="scroll"
          >
            <Column
              header="#"
              headerStyle={{ width: "3em" }}
              body={(data, options) => options.rowIndex + 1}
            ></Column>
            <Column
              field="representative.name"
              header="Representative"
              body={representativeBodyTemplate}
            ></Column>
            <Column field="name" header="Name"></Column>
            <Column
              field="country"
              header="Country"
              body={countryBodyTemplate}
            ></Column>
            <Column field="company" header="Company"></Column>
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
            ></Column>
            <Column field="date" header="Date"></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export default RegCus;
