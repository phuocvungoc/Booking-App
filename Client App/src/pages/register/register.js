import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: e.target.username.value,
      password: e.target.password.value,
      fullName: e.target.fullName.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
    };

    axios
      .post("http://localhost:5000/api/auth/register", user)
      .then((res) => {
        alert("User has been created!");
        navigate("/login");
      })
      .catch((error) => {
        console.log("Error", error.message);
      });
  };

  return (
    <>
      <Navbar />
      <h1 className="register1">Register</h1>
      <div className="login">
        <form className="lContainer" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="username"
            id="username"
            className="reInput"
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            className="reInput"
          />
          <input
            type="text"
            placeholder="full name"
            id="fullName"
            className="reInput"
          />
          <input
            type="text"
            placeholder="phone"
            id="phone"
            className="reInput"
          />
          <input
            type="text"
            placeholder="email"
            id="email"
            className="reInput"
          />
          <button type="submit" name="submit" className="lButton">
            Create Account
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
