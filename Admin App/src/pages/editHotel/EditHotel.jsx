import "./editHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const EditHotel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hotelId = location.pathname.split("/")[3];
  const token = localStorage.getItem("accessToken");

  const { data, loading, error } = useFetch(
    `http://localhost:5000/api/hotels/find/${hotelId}`
  );

  const handleClick = async (e) => {
    e.preventDefault();
    const editHotel = {
      name: e.target.name.value,
      type: e.target.type.value,
      city: e.target.city.value,
      address: e.target.address.value,
      distance: e.target.distance.value,
      title: e.target.title.value,
      desc: e.target.desc.value,
      cheapestPrice: e.target.price.value,
      featured: e.target.featured.value === "true" ? true : false,
      photos: data.photos,
      rooms: data.rooms,
    };

    try {
      await axios
        .put(`http://localhost:5000/api/hotels/${data._id}`, editHotel, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            alert("Edit successful hotels");
            navigate("/hotels");
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
          <h1>Edit Hotel</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleClick}>
              <div className="formInput">
                <label>Name</label>
                <input
                  id="name"
                  defaultValue={data.name}
                  type="text"
                  required
                />
              </div>

              <div className="formInput">
                <label>Type</label>
                <input
                  id="type"
                  defaultValue={data.type}
                  type="text"
                  required
                />
              </div>

              <div className="formInput">
                <label>City</label>
                <input
                  id="city"
                  defaultValue={data.city}
                  type="text"
                  required
                />
              </div>

              <div className="formInput">
                <label>Address</label>
                <input
                  id="address"
                  defaultValue={data.address}
                  type="text"
                  required
                />
              </div>

              <div className="formInput">
                <label>Distance from City Center</label>
                <input
                  id="distance"
                  defaultValue={data.distance}
                  type="text"
                  required
                />
              </div>

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
                  defaultValue={data.cheapestPrice}
                  type="text"
                  required
                />
              </div>

              <div className="formInput">
                <label>Featured</label>
                <select id="featured">
                  <option value={data.featured}>
                    {data.featured ? "Yes" : "No"}
                  </option>
                  <option value={!data.featured}>
                    {!data.featured ? "Yes" : "No"}
                  </option>
                </select>
              </div>
              <button type="submit">Edit Hotel</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHotel;
