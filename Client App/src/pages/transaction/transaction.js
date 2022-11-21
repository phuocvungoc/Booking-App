import {
  faBed,
  faCar,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Tables from "../../components/table/table";
import MailList from "../../components/mailList/MailList";
import useFetch from "../../hooks/useFetch";
import "./transaction.css";

const Transaction = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user.username;

  const { data, loading, error } = useFetch(
    `http://localhost:5000/api/transaction/${userName}`
  );

  return (
    <>
      <Navbar />
      <div className="header">
        <div className="headerList">
          <div className="headerListItem active">
            <FontAwesomeIcon icon={faBed} />
            <span>Stays</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faPlane} />
            <span>Flights</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faCar} />
            <span>Car rentals</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faBed} />
            <span>Attractions</span>
          </div>
          <div className="headerListItem">
            <FontAwesomeIcon icon={faTaxi} />
            <span>Airport taxis</span>
          </div>
        </div>
      </div>
      <div className="transContainer">
        <h3>Your Transaction</h3>
        {loading ? "loading" : <Tables data={data} />}
        <MailList />
        <Footer />
      </div>
    </>
  );
};

export default Transaction;
