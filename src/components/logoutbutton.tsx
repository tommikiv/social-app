import { Button } from "react-native";
import { auth } from "../config/firebaseConfig";

export const LogoutButton = () => {
  const handleLogout = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.error("Logout Error: ", error);
    });
  };

  return (
    <Button onPress={handleLogout} title="Logout" />
  );
};