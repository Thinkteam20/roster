import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import "../App.css";

export const ReportSheet = () => {
  const [products, setProducts] = useState([
    {
      date: "Mon",
      id: "5555",
      name: "Bracelet",
      role: "Mop",
      start: "2021-11-23T12:30:00Z",
      end: "2021-11-23T15:30:00Z",
      description:
        "Product Description Product Description Product Description Product Description",
      wage: 15,
      site: "Shop GL-05, Queens Plaza, 226 Queen Street, Brisbane CBD, QLD 4000",
      quantity: 73,
    },
    {
      date: "Mon",
      id: "5555",
      name: "James",
      role: "Mop",
      start: "2021-11-23T12:30:00Z",
      end: "2021-11-23T15:30:00Z",
      description:
        "Product Description Product Description Product Description Product Description",
      wage: 15,
      site: "Shop GL-05, Queens Plaza, 226 Queen Street, Brisbane CBD, QLD 4000",
      quantity: 73,
    },
    {
      date: "Tue",
      id: "5555",
      name: "Mina",
      role: "Mop",
      start: "2021-11-23T12:30:00Z",
      end: "2021-11-23T15:30:00Z",
      description:
        "Product Description Product Description Product Description Product Description",
      wage: 15,
      site: "Shop GL-05, Queens Plaza, 226 Queen Street, Brisbane CBD, QLD 4000",
      quantity: 73,
    },
  ]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [importedData, setImportedData] = useState([]);
  const [selectedImportedData, setSelectedImportedData] = useState([]);
  const [importedCols, setImportedCols] = useState([
    { field: "", header: "Header" },
  ]);
  const dt = useRef(null);
  const toast = useRef(null);

  const cols = [
    { field: "date", header: "Date" },
    { field: "site", header: "Site" },
    { field: "description", header: "Description" },
    { field: "name", header: "Employee" },
    { field: "start", header: "start" },
    { field: "end", header: "end" },
    { field: "role", header: "Role" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const importCSV = (e) => {
    const file = e.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const data = csv.split("\n");

      // Prepare DataTable
      const cols = data[0].replace(/['"]+/g, "").split(",");
      data.shift();

      let _importedCols = cols.map((col) => ({
        field: col,
        header: toCapitalize(col.replace(/['"]+/g, "")),
      }));
      let _importedData = data.map((d) => {
        d = d.split(",");
        return cols.reduce((obj, c, i) => {
          obj[c] = d[i].replace(/['"]+/g, "");
          return obj;
        }, {});
      });

      setImportedCols(_importedCols);
      setImportedData(_importedData);
    };

    reader.readAsText(file, "UTF-8");
  };

  const importExcel = (e) => {
    const file = e.files[0];

    import("xlsx").then((xlsx) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = xlsx.read(e.target.result, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

        // Prepare DataTable
        const cols = data[0];
        data.shift();

        let _importedCols = cols.map((col) => ({
          field: col,
          header: toCapitalize(col),
        }));
        let _importedData = data.map((d) => {
          return cols.reduce((obj, c, i) => {
            obj[c] = d[i];
            return obj;
          }, {});
        });

        setImportedCols(_importedCols);
        setImportedData(_importedData);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(exportColumns, products);
        doc.save("weekly-roster-iffice.pdf");
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "products");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((FileSaver) => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(
        data,
        fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  };

  const toCapitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const clear = () => {
    setImportedData([]);
    setSelectedImportedData([]);
    setImportedCols([{ field: "", header: "Header" }]);
  };

  const onImportSelectionChange = (e) => {
    setSelectedImportedData(e.value);
    const detail = e.value.map((d) => Object.values(d)[0]).join(", ");
    toast.current.show({
      severity: "info",
      summary: "Data Selected",
      detail,
      life: 3000,
    });
  };

  const onSelectionChange = (e) => {
    setSelectedProducts(e.value);
  };

  const header = (
    <div className="p-d-flex p-ai-center export-buttons">
      <Button
        type="button"
        icon="pi pi-file"
        onClick={() => exportCSV(false)}
        className="p-mr-2"
        data-pr-tooltip="CSV"
      />
      <Button
        type="button"
        icon="pi pi-file-excel"
        onClick={exportExcel}
        className="p-button-success p-mr-2"
        data-pr-tooltip="XLS"
      />
      <Button
        type="button"
        icon="pi pi-file-pdf"
        onClick={exportPdf}
        className="p-button-warning p-mr-2"
        data-pr-tooltip="PDF"
      />
      <Button
        type="button"
        icon="pi pi-filter"
        onClick={() => exportCSV(true)}
        className="p-button-info p-ml-auto"
        data-pr-tooltip="Selection Only"
      />
    </div>
  );

  return (
    <div>
      <div className="card">
        <Tooltip target=".export-buttons>button" position="bottom" />

        <DataTable
          ref={dt}
          value={products}
          header={header}
          dataKey="id"
          responsiveLayout="scroll"
          selectionMode="multiple"
          selection={selectedProducts}
          onSelectionChange={onSelectionChange}
        >
          {cols.map((col, index) => (
            <Column key={index} field={col.field} header={col.header} />
          ))}
        </DataTable>
      </div>
    </div>
  );
};

export default ReportSheet;
