import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import { DataGrid } from "@mui/x-data-grid";
import Widget from "../../components/widget/Widget";
import useFetch from "../../hooks/useFetch";
import { transColumns } from "../../datatablesource";

const Home = () => {
  const { data, loading, error } = useFetch(
    "http://localhost:5000/api/transaction/latest"
  );
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <div className="datatable">
            <DataGrid
              className="datagrid"
              rows={data}
              columns={transColumns}
              pageSize={8}
              rowsPerPageOptions={[8]}
              checkboxSelection
              getRowId={(row) => row._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
