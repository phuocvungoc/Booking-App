import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";

import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Reserve = ({ setOpen, hotelId }) => {
  const { user } = useContext(AuthContext);
  const [sPMethod, setSPMethod] = useState("Cash");
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const { data, loading, error } = useFetch(
    `http://localhost:5000/api/hotels/room/${hotelId}`
  );
  const { dates } = useContext(SearchContext);
  const [dateSearch, setDateSearch] = useState(dates);

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(dateSearch[0].endDate, dateSearch[0].startDate);

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());
    let dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const alldates = getDatesInRange(
    dateSearch[0].startDate,
    dateSearch[0].endDate
  );

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const totalPrice = (selectedRooms) => {
    let total = 0;
    selectedRooms.map((item) => {
      const dataRoom = data.find((i) =>
        i.roomNumbers.some((roomNumber) => roomNumber._id === item)
      );
      total = total + dataRoom.price * days;
    });

    return total;
  };

  const dateBooking = (date) => {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return dd + "/" + mm + "/" + yyyy;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    let roomNumber;
    data.map((room) => {
      room.roomNumbers.map((item) => {
        if (item._id === value) {
          roomNumber = item.number;
        }
      });
    });

    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );

    setRooms(
      checked
        ? [...rooms, roomNumber]
        : rooms.filter((item) => item !== roomNumber)
    );
  };

  const handleChangeMethod = (e) => {
    setSPMethod(e.target.value);
  };

  const navigate = useNavigate();

  const handleClick = async () => {
    if (totalPrice(selectedRooms) === 0) {
      alert("Please select a room before booking");
    } else {
      try {
        await Promise.all(
          selectedRooms.map((roomId) => {
            const res = axios.put(
              `http://localhost:5000/api/rooms/availability/${roomId}`,
              {
                dates: alldates,
              }
            );
            return res.data;
          })
        );

        axios
          .post(`http://localhost:5000/api/transaction/`, {
            username: user.username,
            hotels: hotelId,
            rooms: rooms,
            roomsId: selectedRooms,
            date:
              dateBooking(dateSearch[0].startDate) +
              " - " +
              dateBooking(dateSearch[0].endDate),
            totalPrice: totalPrice(selectedRooms),
            payment: sPMethod,
            status: "Booked",
          })
          .then((res) => {
            alert("Room booked successfully");
            setOpen(false);
            navigate("/transaction");
            return res.data;
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <div className="reserve">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <div className="rDate">
          <h1>Dates</h1>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDateSearch([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateSearch}
            minDate={new Date()}
          />
        </div>
        <div className="lContainer">
          <h1>Reserve Info</h1>
          <form>
            <div className="lItem">
              <label htmlFor="fullName">Your Full Name:</label>
              <br />
              <input
                type="text"
                placeholder="Full Name"
                id="fullName"
                defaultValue={user.fullName}
                className="rInput"
              />
            </div>
            <div className="lItem">
              <label htmlFor="email">Your Email:</label>
              <br />
              <input
                type="text"
                placeholder="Email"
                id="email"
                defaultValue={user.email}
                className="rInput"
              />
            </div>
            <div className="lItem">
              <label htmlFor="phone">Your Phone Number:</label>
              <br />
              <input
                type="text"
                placeholder="Number Phone"
                id="phone"
                defaultValue={user.phone}
                className="rInput"
              />
            </div>
            <div className="lItem">
              <label htmlFor="IdCard">Your Identity Card Number:</label>
              <br />
              <input
                type="text"
                placeholder="Identity Card"
                id="IdCard"
                className="rInput"
              />
            </div>
          </form>
        </div>
      </div>
      <div className="rContainer">
        <span>
          <b>Select your rooms:</b>
        </span>
        <div className="Items">
          {data.map((item) => (
            <div className="rItem" key={item._id}>
              <div className="rItemInfo">
                <div className="rTitle">{item.title}</div>
                <div className="rDesc">{item.desc}</div>
                <div className="rMax">
                  Max people: <b>{item.maxPeople}</b>
                </div>
                <div className="rPrice">${item.price}</div>
              </div>
              <div className="rSelectRooms">
                {item.roomNumbers.map((roomNumber) => (
                  <div className="room" key={roomNumber._id}>
                    <label>{roomNumber.number}</label>
                    <input
                      type="checkbox"
                      value={roomNumber._id}
                      onChange={handleSelect}
                      disabled={!isAvailable(roomNumber)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="tContainer">
        <span>
          <h3>Total Bill: ${totalPrice(selectedRooms)}</h3>
        </span>
        <select
          name="spMethod"
          className="tSelect"
          onChange={handleChangeMethod}
        >
          <option value="spMethod">Select Payment Method</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Cash">Cash</option>
        </select>
      </div>
      <button onClick={handleClick} className="rButton">
        Reserve Now!
      </button>
    </>
  );
};

export default Reserve;
