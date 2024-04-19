import "/src/css/newform.css";
import "/src/css/main.css";
import Button from "@mui/material/Button";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "/src/components/auth/firebase";
import { collection, addDoc } from "firebase/firestore";
import useFirebaseAuth from "../../auth/AuthFirebase";

import AddProduct from "../common/AddProduct";
import HeadArrowBack from "../nav/HeadArrowBack";
import NavBottom from "../nav/NavBottom";
import DragDropProductList from "../common/DragDropProductList";

export default function NewList() {
  // load user info
  const { user, username } = useFirebaseAuth();

  // navigation
  const navigate = useNavigate();

  // state
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState([]);

  // create new doc in firebase collection with array of objects in rows
  const addNewGroceryList = async (title, rows) => {
    if (title === "" || rows.length === 0) {
      alert("No Title or Product. Check your list again!");
      return;
    }

    try {
      if (!user || !username) {
        console.error("User is not authenticated or displayName is undefined.");
        return;
      }

      const colRef = collection(db, "users", username, "grocerylists");
      const docRef = await addDoc(colRef, {
        title: title,
        products: rows,
      });

      console.log("Document written with ID: ", docRef.id);
      alert("Grocery list sent to Database");
      navigate(`/users/${username}/grocerylists/${docRef.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <div className="content">
        <HeadArrowBack />
        <div className="title-welcome">
          <h1>Create New Grocery List</h1>
        </div>

        <AddProduct
          title={title}
          setTitle={setTitle}
          product={product}
          setProduct={setProduct}
          amount={amount}
          setAmount={setAmount}
          rows={rows}
          setRows={setRows}
        />

        <div className="title-product-list">
          <h2>List</h2>
        </div>
        <div className="product-list-container">
          <div className="product-list-container__header">
            <div>Amount</div>
            <div>Product</div>
            <div>Delete</div>
          </div>
          <DragDropProductList rows={rows} setRows={setRows} />
        </div>
        <div className="submit-event-btn">
          <Button
            id="submit-list"
            variant="contained"
            onClick={() => addNewGroceryList(title, rows)}
          >
            Create List
          </Button>
        </div>
      </div>
      <NavBottom />
    </>
  );
}