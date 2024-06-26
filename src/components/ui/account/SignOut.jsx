import { signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const SignOut = () => {
  // Instantiate the auth service SDK
  const auth = getAuth();
  const navigate = useNavigate(); // Hook to access the navigation object

  const handleSignOut = () => {
    // Sign out the user
    signOut(auth)
      .then(() => {
        // Redirect to the "/" route upon successful sign-out
        navigate("/");
        console.log("Successfully signed out");
      })
      .catch((error) => {
        // Handle sign-out errors
        console.error("Error signing out:", error);
      });
  };

  return (
    <section className="home">
      <div className="home__container">
        <Button id="sign-out" variant="contained" onClick={handleSignOut}>
          Ausloggen
        </Button>
      </div>
    </section>
  );
};

export default SignOut;
