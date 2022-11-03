import * as React from "react";
import Sidebar from "./Sidebar";

import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";
import { forwardRef } from "react";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { useState, useEffect } from "react";

import axios from "axios";
import { useCookies } from "react-cookie";

// import dayjs from "dayjs";
import "dayjs/locale/th";

function Main({ children }) {
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };

  const [columns, setColumns] = useState([
    /* 
      add a property "hidden: true" 
      to hide the column
    */
    { title: "เลขระเบียน", field: "id", editable: false, hidden: true },
    { title: "กิจกรรม", field: "name" },
    {
      title: "วันเวลา",
      field: "when",

      /* 
        change to date&time picker
      */
      initialEditValue: "yyyy-MM-ddTHH:mm:ss",
    },
  ]);

  const [data, setData] = useState([]);

  /* 
    custom theme font by adding typography
  */
  const defaultMaterialTheme = createTheme({
    typography: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
    },
  });

  let [cookies] = useCookies(["token"]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/activities", {
        headers: { Authorization: "Bearer " + cookies["token"] },
        timeout: 10 * 1000,
      })
      .then((response) => {
        const data = response.data;
        console.log(data);

        // /*
        //   format date & time
        // */
        // const dataFormat = data.map(function (a) {
        //   return dayjs(a.when)
        //     .locale("th")
        //     .add(543, "year")
        //     .format("D MMM YY [เวลา] hh:mm");
        // });
        // console.log(dataFormat);

        // for (let i = 0; i < data.length; i++) {
        //   const element = data[i];
        //   element.when = dataFormat[i];
        // }

        setData(data);
      })
      .catch((error) => {
        if (error.code === "ECONNABORTED") {
          console.log("timeout");
        } else {
          console.log(error.response.status);
        }
      });
  }, []);

  return (
    <div id="outer-container">
      <Sidebar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
      <div id="page-wrap">
        <ThemeProvider theme={defaultMaterialTheme}>
          <MaterialTable
            icons={tableIcons}
            title={
              <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To Do</h1>
            }
            columns={columns}
            data={data}
            editable={{
              onRowAddCancelled: (rowData) => {
                /* do nothing */
              },
              onRowUpdateCancelled: (rowData) => {
                /* do nothing */
              },
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    axios
                      .post(
                        "http://localhost:5000/activities",
                        { name: newData.name, when: newData.when },
                        {
                          headers: {
                            Authorization: "Bearer " + cookies["token"],
                          },
                          timeout: 10 * 1000,
                        }
                      )
                      .then((response) => {
                        newData.id = response.data.id;
                        setData([...data, newData]);
                        /* 
                          alert success "POST"
                        */
                        alert("add success");
                      })
                      .catch((error) => {
                        if (error.code === "ECONNABORTED") {
                          console.log("timeout");
                        } else {
                          console.log(error.response.status);
                        }
                      });
                    resolve();
                  }, 1000);
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    axios
                      .put(
                        "http://localhost:5000/activities/" + oldData.id,
                        { name: newData.name, when: newData.when },
                        {
                          headers: {
                            Authorization: "Bearer " + cookies["token"],
                          },
                          timeout: 10 * 1000,
                        }
                      )
                      .then((response) => {
                        const dataUpdate = [...data];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        setData([...dataUpdate]);
                        /* 
                          alert success "PUT" 
                        */
                        alert("update success");
                      })
                      .catch((error) => {
                        if (error.code === "ECONNABORTED") {
                          console.log("timeout");
                        } else {
                          console.log(error.response.status);
                        }
                      });
                    resolve();
                  }, 1000);
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    axios
                      .delete(
                        "http://localhost:5000/activities/" + oldData.id,
                        {
                          headers: {
                            Authorization: "Bearer " + cookies["token"],
                          },
                          timeout: 10 * 1000,
                        }
                      )
                      .then((response) => {
                        const dataDelete = [...data];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        setData([...dataDelete]);
                        /* 
                          alert success "DELETE" 
                        */
                        alert("delete success");
                      })
                      .catch((error) => {
                        if (error.code === "ECONNABORTED") {
                          console.log("timeout");
                        } else {
                          console.log(error.response.status);
                        }
                      });
                    resolve();
                  }, 1000);
                }),
            }}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}

export default Main;
