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
import * as XLSX from "xlsx";
import "./DataTableDemo.css";
import HeaderTile from "../../Morecules/HeaderTile.js";
import "../../../App.css";
// import sendAsync from "../../../message-control/renderer.js";
// import addTable from "../../../message-control/addEmp.js";
// import addValueAsync from "../../../message-control/addValue.js";

function RegEmp2() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [dataNumber, setDatanNumber] = useState();

  let testlogs = {
    text: "",
    priority: "",
    user: "",
    time: null,
  };

  let emptyProduct = {
    id: null,
    name: "",
    role: null,
    description: "",
    start: "",
    end: "",
    site: null,
    wage: 0,
    email: "",
  };

  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [log, setLog] = useState(testlogs);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [worksite, setWorksites] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    ipcRenderer.send("logs2:load");
    ipcRenderer.on("logs2:get", (e, logs) => {
      console.log("get data from Mongo db");
      // console.log(logs);
      // setProducts(logs);
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

    if (product.name.trim()) {
      let _products = [...products];
      let _product = { ...product };
      console.log(_product);
      let _deleteTarget = product.id;
      if (product.id) {
        const index = findIndexById(product.id);
        _products[index] = _product;
        console.log(_deleteTarget);
        ipcRenderer.send("logs2:update", _deleteTarget, _product);
        setProducts(_products);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Updated",
          life: 3000,
        });
      } else {
        _product.id = createId();
        // _product.image = "product-placeholder.svg";
        _products.push(_product);
        ipcRenderer.send("logs2:emp", _products);
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
    ipcRenderer.send("logs2:delete", deleteTarget);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Employ Deleted",
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

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const readExel = (file) => {
    const promise = new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      // ConvertKeysToLowerCase(d);
      setProducts(d);
      ipcRenderer.send("logs2:bulk", d);
    });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));
    ipcRenderer.send("logs2:delete2", selectedProducts);
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Employees Deleted",
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

  const onEmailChange = (e, email) => {
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
        <Button>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              readExel(file);
            }}
          />
        </Button>
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
            field="id"
            header="Id"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>

          <Column
            field="name"
            header="Name"
            sortable
            style={{ minWidth: "11rem" }}
          ></Column>

          <Column
            field="start"
            header="Start"
            sortable
            style={{ minWidth: "11rem" }}
          ></Column>

          <Column
            field="end"
            header="End"
            sortable
            style={{ minWidth: "11rem" }}
          ></Column>

          <Column
            field="role"
            header="Role"
            body={priceBodyTemplate}
            sortable
            style={{ minWidth: "8rem" }}
          ></Column>

          <Column
            field="site"
            header="Site"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>

          <Column
            field="description"
            header="Description"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>

          <Column
            field="email"
            header="Email"
            body={statusBodyTemplateEmail}
            sortable
            style={{ minWidth: "12rem" }}
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

  const statusBodyTemplateEmail = (rowData) => {
    return (
      <span className={`product-badge status-${rowData.email.toLowerCase()}`}>
        {rowData.email}
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
        tileTitle="ADD EMPLOYEES"
        tileName="Sydney"
        before="/"
        next=""
      />
      <h1>Employees</h1>
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
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                value={product.name}
                onChange={(e) => onInputChange(e, "name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !product.name,
                })}
              />
              {submitted && !product.name && (
                <small className="p-error">Name is required.</small>
              )}
            </div>

            <div className="p-field">
              <label htmlFor="description">Description</label>
              <InputTextarea
                id="description"
                value={product.description}
                onChange={(e) => onInputChange(e, "description")}
                required
                rows={3}
                cols={20}
              />
            </div>

            <div className="p-field">
              <label className="p-mb-3">Role</label>
              <div className="p-formgrid p-grid">
                <div className="p-field-radiobutton p-col-6">
                  <RadioButton
                    inputId="category1"
                    name="category"
                    value="Mop"
                    onChange={onCategoryChange}
                    checked={product.role === "Mop"}
                  />
                  <label htmlFor="category1">Mop</label>
                </div>
                <div className="p-field-radiobutton p-col-6">
                  <RadioButton
                    inputId="category2"
                    name="category"
                    value="Vacumme"
                    onChange={onCategoryChange}
                    checked={product.role === "Vacumme"}
                  />
                  <label htmlFor="category2">Vacumme</label>
                </div>
                <div className="p-field-radiobutton p-col-6">
                  <RadioButton
                    inputId="category3"
                    name="category"
                    value="Dusting"
                    onChange={onCategoryChange}
                    checked={product.role === "Dusting"}
                  />
                  <label htmlFor="category3">Dusting</label>
                </div>
                <div className="p-field-radiobutton p-col-6">
                  <RadioButton
                    inputId="category4"
                    name="category"
                    value="Vacuum & Mop"
                    onChange={onCategoryChange}
                    checked={product.role === "Vacuum & Mop"}
                  />
                  <label htmlFor="category4">Vacuum & Mop</label>
                </div>
                <div className="p-field-radiobutton p-col-6">
                  <RadioButton
                    inputId="category5"
                    name="category"
                    value="Dusting/Office"
                    onChange={onCategoryChange}
                    checked={product.role === "Dusting/Office"}
                  />
                  <label htmlFor="category5">Dusting/Office</label>
                </div>
              </div>
            </div>

            <div className="p-field">
              <label htmlFor="category5">Start Time</label>
              <input type="datetime-local" onChange={onTimeStartChange} />
            </div>

            <div className="p-field">
              <label htmlFor="category5">End Time</label>
              <input type="datetime-local" onChange={onTimeEndChange} />
            </div>

            <div className="p-formgrid p-grid">
              <div className="p-field p-col">
                <label htmlFor="price">Wage</label>
                <InputNumber
                  id="wage"
                  value={product.wage}
                  onValueChange={(e) => onInputNumberChange(e, "wage")}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                />
              </div>
              <div className="p-field">
                <label htmlFor="email">Email</label>
                <InputText
                  id="email"
                  value={product.email}
                  onChange={(e) => onInputChange(e, "email")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !product.email,
                  })}
                />
                {submitted && !product.email && (
                  <small className="p-error">Email is required.</small>
                )}
              </div>
              <div className="p-field p-col">
                <label htmlFor="quantity">Site</label>
                <Dropdown
                  value={worksite}
                  options={sites}
                  onChange={onSitesChange}
                  optionLabel="name"
                  placeholder="Select Sites"
                />
              </div>
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

export default RegEmp2;
