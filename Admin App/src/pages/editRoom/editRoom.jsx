import "./editRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const EditRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.pathname.split("/")[3];
  const token = localStorage.getItem("accessToken");

  const { data, loading, error } = useFetch(
    `http://localhost:5000/api/rooms/${roomId}`
  );

  const handleClick = async (e) => {
    e.preventDefault();
    const editRoom = {
      title: e.target.title.value,
      desc: e.target.desc.value,
      price: e.target.price.value,
      maxPeople: e.target.maxPeople.value,
      roomNumbers: data.roomNumbers,
    };

    try {
      await axios
        .put(`http://localhost:5000/api/rooms/${roomId}`, editRoom, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            alert("Edit successful rooms");
            navigate("/rooms");
            return res.data;
          } else {
            alert("Failed, please recheck the transmission");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleClick}>
              <div className="formInput">
                <label>Title</label>
                <input
                  id="title"
                  defaultValue={data.title}
                  type="text"
                  required
                />
              </div>
              <div className="formInput">
                <label>Description</label>
                <input
                  id="desc"
                  defaultValue={data.desc}
                  type="text"
                  required
                />
              </div>
              <div className="formInput">
                <label>Price</label>
                <input
                  id="price"
                  defaultValue={data.price}
                  type="text"
                  required
                />
              </div>
              <div className="formInput">
                <label>Max People</label>
                <input
                  id="maxPeople"
                  defaultValue={data.maxPeople}
                  type="text"
                  required
                />
              </div>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoom;
