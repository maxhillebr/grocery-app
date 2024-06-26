import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "/src/components/auth/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import useFirebaseAuth from "/src/components/auth/AuthFirebase";

import EditNoteIcon from "@mui/icons-material/EditNote";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";

import { copyToClipboard } from "../common/CopyToClipboard";
import { generateUUID } from "../../common/UUIDGenerator";

export default function GroceryBoxMain() {
  // unique id
  const newId = generateUUID();

  // load user info
  const { user, username } = useFirebaseAuth();

  // db, copy to clipboard path
  const groceryListPath = "grocerylists";

  // Define groceryLists state to store fetched data
  const [groceryLists, setGroceryLists] = useState([]);

  // Fetch data from Firestore inside useEffect
  useEffect(() => {
    const fetchGroceryLists = async () => {
      try {
        if (!user || !username) {
          console.error(
            "User is not authenticated or display name is undefined."
          );
          return; // Exit the function early
        }

        fetchColGetDoc();
      } catch (error) {
        console.error("Error fetching grocery lists:", error);
      }
    };

    fetchGroceryLists();
  }, []); // Empty dependency array to fetch data only once on component mount

  const fetchColGetDoc = async () => {
    const colRef = collection(db, "users", username, groceryListPath);
    const querySnapshot = await getDocs(colRef);
    const lists = [];

    querySnapshot.forEach((doc) => {
      lists.push({ ...doc.data(), id: doc.id });
    });

    setGroceryLists(lists);
    console.log(lists);
  };

  const handleDeleteDoc = async (id) => {
    const colRef = doc(db, "users", username, groceryListPath, id);
    await deleteDoc(colRef);

    console.log("Document deleted", id);
    alert("Einkaufsliste geupdated");
    fetchColGetDoc();
  };

  return (
    <>
      {groceryLists.map(function (data) {
        return (
          <div className="grocery-list-container__box" key={data.id}>
            <a href={`/users/${username}/${groceryListPath}/${data.id}`}>
              <div className="grocery-list-container__tag-title">
                <p className="grocery-list-container__tag--main">
                  Einkaufsliste
                </p>
                <h3>{data.title}</h3>
              </div>
            </a>
            <div className="grocery-list-container__action-btn">
              <Link
                to={`/users/${username}/${groceryListPath}/${data.id}/edit`}
              >
                <div className="grocery-list-container__action-btn--edit">
                  <EditNoteIcon />
                </div>
              </Link>
              <div
                className="grocery-list-container__action-btn--share"
                onClick={() =>
                  copyToClipboard(username, groceryListPath, data.id)
                }
              >
                <ShareIcon />
              </div>
              <div
                className="grocery-list-container__action-btn--del"
                onClick={() => handleDeleteDoc(data.id)}
              >
                <DeleteIcon />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
