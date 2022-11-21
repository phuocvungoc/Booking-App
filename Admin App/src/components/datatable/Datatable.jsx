import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const Datatable = ({ columns }) => {
  const [hotels, setHotels] = useState([]);
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState();
  const token = localStorage.getItem("accessToken");
  const { data, loading, error } = useFetch(
    `http://localhost:5000/api/${path}`
  );

  let pageName;
  switch (path) {
    case "users":
      pageName = "Users List";
      break;
    case "hotels":
      pageName = "Hotels List";
      break;
    case "rooms":
      pageName = "Rooms List";
      break;
    default:
      break;
  }

  useEffect(() => {
    setList(data);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/hotels");
        setHotels(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete the hotel?")) {
      try {
        await axios
          .delete(`http://localhost:5000/api/${path}/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.status == 200) {
              alert("Delete successfully");
              setList(list.filter((item) => item._id !== id));
              return res.data;
            } else {
              alert("Failed, please recheck the transmission");
            }
          });
      } catch (err) {
        if (err.response.status == 505) {
          alert("The hotel is still booked");
        }
        console.log(err);
      }
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Delete the room?")) {
      let hotel;
      hotels.map((ht) => {
        ht.rooms.find((item) => {
          if (item === id) hotel = ht;
        });
      });
      const hotelId = hotel._id;
      try {
        await axios
          .delete(`http://localhost:5000/api/rooms/${id}/${hotelId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.status == 200) {
              alert("Delete successfully");
              setList(list.filter((item) => item._id !== id));
              return res.data;
            } else {
              alert("Failed, please recheck the transmission");
            }
          });
      } catch (err) {
        if (err.response.status == 505) {
          alert("The room is still booked");
        }
        console.log(err);
      }
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() =>
                path !== "rooms"
                  ? handleDelete(params.row._id)
                  : handleDeleteRoom(params.row._id)
              }
            >
              Delete
            </div>
            <Link
              to={`/${path}/edit/${params.row._id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="editButton">Edit</div>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {pageName}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>

      <DataGrid
        className="datagrid"
        rows={list || data}
        columns={columns.concat(actionColumn)}
        pageSize={8}
        rowsPerPageOptions={[8]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
