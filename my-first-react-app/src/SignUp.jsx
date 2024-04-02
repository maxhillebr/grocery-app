import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";

import { db } from "./firebase";
import { doc, collection, addDoc, getDoc, setDoc } from "firebase/firestore";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // instantiate the auth service SDK
  const auth = getAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "username") setUsername(value);
  };

  // Handle user sign up with email and password
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      updateProfile(auth.currentUser, {
        displayName: username,
      });

      createGroceryListCollection(username);

      navigate("/home");
    } catch (err) {
      // Handle errors here
      const errorMessage = err.message;
      const errorCode = err.code;

      setError(true);

      switch (errorCode) {
        case "auth/weak-password":
          setErrorMessage("The password is too weak.");
          break;
        case "auth/email-already-in-use":
          setErrorMessage(
            "This email address is already in use by another account."
          );
        case "auth/invalid-email":
          setErrorMessage("This email address is invalid.");
          break;
        case "auth/operation-not-allowed":
          setErrorMessage("Email/password accounts are not enabled.");
          break;
        default:
          setErrorMessage(errorMessage);
          break;
      }
    }
  };

  const createGroceryListCollection = async (username) => {
    try {
      // Constructing Firestore references
      await setDoc(doc(db, "users", username, "grocerylists", "first-list"), {
        title: "My First Grocery List",
        description: "Description test.",
        products: "products here",
      });
      console.log("Grocery list collection created successfully!");
    } catch (error) {
      console.error("Error creating grocery list collection:", error);
    }
  };

  return (
    <div className="first-pages-flex-container">
      <img
        src="/freshfinds-logo.png"
        alt="freshfinds Logo"
        style={{ width: "200px" }}
      />
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          required
          type="text"
          id="username-input"
          label="Username"
          name="username"
          margin="normal"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          required
          type="email"
          id="e-mail-input"
          label="E-Mail"
          name="email"
          margin="normal"
          fullWidth
          onChange={handleChange}
        />
        <TextField
          required
          type="password"
          id="password-input"
          label="Password"
          name="password"
          margin="normal"
          fullWidth
          onChange={handleChange}
        />
        <Button fullWidth type="submit" variant="contained">
          Sign Up
        </Button>
        {error && <p>{errorMessage}</p>}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
