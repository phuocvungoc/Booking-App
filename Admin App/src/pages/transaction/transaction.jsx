import "./transaction.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import useFetch from "../../hooks/useFetch";

const Transaction = ({ columns }) => {
  const { data, loading, error } = useFetch(
    "http://localhost:5000/api/transaction"
  );

  return (
    <div className="trans">
      <Sidebar />
      <div className="transContainer">
        <Navbar />
        <div className="datatable">
          <div className="datatableTitle">Transaction</div>
          <DataGrid
            className="datagrid"
            rows={data}
            columns={columns}
            pageSize={9}
            rowsPerPageOptions={[9]}
            checkboxSelection
            getRowId={(row) => row._id}
          />
        </div>
      </div>
    </div>
  );
};

export default Transaction;
