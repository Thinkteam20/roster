import React, { useState, useEffect, useRef } from "react";
import { ipcRenderer } from "electron";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import "./DataTableDemo.css";
import HeaderTile from "../../Morecules/HeaderTile.js";
import "../../../App.css";

// import sendAsync from "../../../message-control/renderer.js";
// import addTable from "../../../message-control/addEmp.js";
// import addValueAsync from "../../../message-control/addValue.js";

function RegCus2() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [dataNumber, setDatanNumber] = useState();

  let testlogs = {
    title: "Versace",
    id: "1",
    site: "Versace",
    roles: "Auditorium A",
    location: "123CBD",
  };

  let events = {
    title: "Versace",
    id: "1",
    site: "Versace",
    roles: "Auditorium A",
    location: "123CBD",
  };

  let emptyProduct = {
    title: "",
    id: "",
    site: "",
    roles: "",
    location: "",
  };

  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [log, setLog] = useState(events);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(events);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [worksite, setWorksites] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    ipcRenderer.send("cusc:load");
    ipcRenderer.on("cusc:get", (e, logs) => {
      console.log("get data from Mongo db");
      setProducts(JSON.parse(logs));
    });
  }, []);

  const sites = [
    { name: "Burberry - CBD Queens Plaza" },
    { name: "Bvlgari - CBD Queens Plaza" },
    { name: "Chanel - CBD Queens Plaza" },
    { name: "Chanel - Westfield Carindale" },
    { name: "Gucci - CBD Brisbane Fashion Boutique" },
    { name: "Gucci - CBD Brisbane Watches & Jewelleries" },
    { name: "Longchamp - CBD Tattersall Arcade" },
    { name: "Louis Vuitton - CBD Queens Plaza" },
    { name: "Paspaley - CBD Queens Plaza" },
    { name: "Tag Heuer - CBD MacArthur Central Shopping Centre" },
    { name: "The Hour Glass - CBD Edward Street" },
    { name: "Yves Saint Laurent - CBD Queens Plaza" },
  ];

  const formatCurrency = (value) => {
    return value;
  };

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);
    if (product.title.trim()) {
      let _products = [...products];
      let _product = { ...product };
      console.log(_product);
      let _deleteTarget = product.groupId;
      console.log(_deleteTarget);
      if (product.groupId) {
        const index = findIndexById(product.groupId);
        _products[index] = _product;
        console.log(_deleteTarget, _products[index]);
        ipcRenderer.send("cusc:update", _deleteTarget, _product);
        setProducts(_products);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Updated",
          life: 3000,
        });
      } else {
        _product.groupId = createGroupId();
        _products.push(_product);
        ipcRenderer.send("cusc:add", _products);
        setProducts(_products);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }
      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const createCus = () => {
    ipcRenderer.send("cusb:add", product);
  };

  // const createCuswithEvent = () => {
  //   ipcRenderer.send("createCustomer", [testlogs, events]);
  // };

  const editProduct = (product) => {
    console.log(product);
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    // console.log(product);
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = products.filter((val) => val.id !== product.id);
    let _selected = products.filter((val) => val.name === product.name);
    let deleteTarget = product.id;
    console.log(deleteTarget);
    ipcRenderer.send("cusc:delete", deleteTarget);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Customer Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createGroupId = () => {
    let GroupId = "";
    let chars = "0123456789";
    for (let i = 0; i < 5; i++) {
      GroupId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return GroupId;
  };

  const importCSV = (e) => {
    const file = e.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const data = csv.split("\n");
      console.log(csv, data);
      // Prepare DataTable
      const cols = data[0].replace(/['"]+/g, "").split(",");
      data.shift();
      console.log(cols);
      const importedData = data.map((d) => {
        d = d.split(",");
        const processedData = cols.reduce((obj, c, i) => {
          c =
            c === "Status"
              ? "inventoryStatus"
              : c === "Reviews"
              ? "rating"
              : c.toLowerCase();
          obj[c] = d[i].replace(/['"]+/g, "");
          (c === "price" || c === "rating") && (obj[c] = parseFloat(obj[c]));
          return obj;
        }, {});

        processedData["id"] = createId();
        return processedData;
      });

      const _products = [...products, ...importedData];

      setProducts(_products);
    };

    reader.readAsText(file, "UTF-8");
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));
    ipcRenderer.send("logs:delete2", products);
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Customer Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _product = { ...product };
    _product["role"] = e.value;
    setProduct(_product);
  };

  const onTimeChange = (e) => {
    let _product = { ...product };
    _product["time"] = e.target.value;
    setProduct(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };
    _product[`${name}`] = val;
    setProduct(_product);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success p-mr-2"
          onClick={openNew}
        />
        {/* <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
        /> */}
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        {/* <FileUpload
          mode="basic"
          name="demo[]"
          auto
          url="http://localhost:8080"
          accept=".csv"
          chooseLabel="Import"
          className="p-mr-2 p-d-inline-block"
          onUpload={importCSV}
        /> */}
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };
  function ProductTable() {
    if (products && products.length) {
      return (
        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
            exportable={false}
          ></Column>

          <Column
            field="title"
            header="Title"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>

          <Column
            field="id"
            header="Id"
            sortable
            style={{ minWidth: "11rem" }}
          ></Column>

          <Column
            field="site"
            header="Site"
            sortable
            style={{ minWidth: "11rem" }}
          ></Column>

          <Column
            field="roles"
            header="Roles"
            sortable
            style={{ minWidth: "11rem" }}
          ></Column>

          <Column
            field="location"
            header="Location"
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>

          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        </DataTable>
      );
    } else {
      return null;
    }
  }

  const onTimeStartChange = (e) => {
    let _product = { ...product };
    _product["start"] = e.target.value;
    setProduct(_product);
  };

  const onTimeEndChange = (e) => {
    let _product = { ...product };
    _product["end"] = e.target.value;
    setProduct(_product);
  };

  const onSitesChange = (e) => {
    setWorksites(e.value);
    let _product = { ...product };
    _product["site"] = e.value["name"];
    setProduct(_product);
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.role);
  };

  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span
        className={`product-badge status-${rowData.description.toLowerCase()}`}
      >
        {rowData.description}
      </span>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="p-mx-0 p-my-1">Manage Employees</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveProduct}
      />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );

  return (
    <section id="emp-landing" className="section section__container">
      <HeaderTile
        tileTitle="ADD Customer (Brisbane)"
        tileName="Sydney Customers"
        before="/"
        next=""
      />
      <div className="emp-table">
        <div className="datatable-crud-demo">
          <Toast ref={toast} />
          <div className="card">
            <Toolbar
              className="p-mb-4"
              left={leftToolbarTemplate}
              right={rightToolbarTemplate}
            ></Toolbar>
          </div>
          <ProductTable />
          <Dialog
            visible={productDialog}
            style={{ width: "450px" }}
            header="Register Employee"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            <div className="p-field">
              <label htmlFor="name">GroupId</label>
              <InputText
                id="id"
                value={product.id}
                onChange={(e) => onInputChange(e, "id")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !product.id,
                })}
              />
              {submitted && !product.id && (
                <small className="p-error">groupId is required.</small>
              )}
            </div>

            <div className="p-field">
              <label htmlFor="description">title</label>
              <InputTextarea
                id="title"
                value={product.title}
                onChange={(e) => onInputChange(e, "title")}
                required
                rows={3}
                cols={20}
              />
            </div>

            <div className="p-field">
              <label htmlFor="site">Site</label>
              <InputText
                id="site"
                value={product.site}
                onChange={(e) => onInputChange(e, "site")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !product.site,
                })}
              />
              {submitted && !product.site && (
                <small className="p-error">Site is required.</small>
              )}
            </div>

            <div className="p-field">
              <label htmlFor="roles">Roles</label>
              <InputText
                id="roles"
                value={product.roles}
                onChange={(e) => onInputChange(e, "roles")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !product.roles,
                })}
              />
              {submitted && !product.roles && (
                <small className="p-error">Roles is required.</small>
              )}
            </div>

            <div className="p-field">
              <label htmlFor="location">Location</label>
              <InputTextarea
                id="location"
                value={product.location}
                onChange={(e) => onInputChange(e, "location")}
                required
                rows={3}
                cols={20}
              />
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteProductDialogFooter}
            onHide={hideDeleteProductDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: "2rem" }}
              />
              {product && (
                <span>
                  Are you sure you want to delete <b>{product.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: "2rem" }}
              />
              {product && (
                <span>
                  Are you sure you want to delete the selected products?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </section>
  );
}

export default RegCus2;
