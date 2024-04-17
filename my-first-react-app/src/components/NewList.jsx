import "/src/css/newform.css";
import "/src/css/main.css";

import React, { useState, useId } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import { db } from "/src/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import HeadArrowBack from "/src/components/HeadArrowBack";
import NavBottom from "./NavBottom";
import AddProduct from "./AddProduct";

export default function NewList() {
  const generateUUID = () => {
    let uuid = "";
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

    for (let i = 0; i < 25; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += "-";
      }
      uuid += chars[randomNumber];
    }
    return uuid;
  };

  // unique id
  const newId = generateUUID();

  // check if the user is logged in?
  const auth = getAuth();
  const user = auth.currentUser;

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleProductChange = (event) => {
    setProduct(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleAddProducts = () => {
    const newData = createData(newId, product, amount);
    setRows((prevRows) => [...prevRows, newData]);
    setProduct("");
    setAmount("");
  };

  const createData = (id, name, amount) => {
    return { id, name, amount };
  };

  const handleDelete = (id) => {
    const updatedRows = rows.filter((product) => product.id !== id);
    setRows(updatedRows);
  };

  // --------------------------------
  // --------------------------------

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(rows);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRows(items);
  };

  // --------------------------------
  // --------------------------------

  const addNewGroceryList = async (title, description, rows) => {
    if (title === "" || description === "" || rows.length === 0) {
      alert("No Title, Description or Product. Check your list again!");
      return;
    }

    try {
      const username = user.displayName;

      if (!user || !username) {
        console.error(
          "User is not authenticated or display name is undefined."
        );
        return; // Exit the function early
      }

      const colRef = collection(db, "users", username, "grocerylists");
      const docRef = await addDoc(colRef, {
        title: title,
        description: description,
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

        <div className="title-desc-container">
          <TextField
            required
            id="grocery-list-title"
            className="title-desc-container__title"
            label="Title"
            value={title}
            onChange={handleTitleChange}
          />
          <TextField
            required
            id="grocery-list-description"
            className="title-desc-container__desc"
            label="Description"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div className="title-add">
          <h2>Add Products</h2>
        </div>

        <AddProduct />
        <div className="submit-event-btn">
          <Button
            id="submit-list"
            variant="contained"
            onClick={() => addNewGroceryList(title, description, rows)}
          >
            Create List
          </Button>
        </div>
      </div>
      <NavBottom />
    </>
  );
}
