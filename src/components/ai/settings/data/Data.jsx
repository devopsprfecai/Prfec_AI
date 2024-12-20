// import React from 'react'
// import { UserAuth } from '@context/AuthContext';
// import { deleteUser } from 'firebase/auth'; // Import deleteUser method
// import { database } from '@firebase'; // Import Firebase database
// import { ref, remove } from 'firebase/database'; // Import methods for database

// const Data = () => {
//   const { user, logOut } = UserAuth();

//   const handleLogOut = async () => {
//       try {
//         console.log("Logout Working");
//         await logOut();
//         setHover(false);
//         setMenuOpen(false); // Explicitly close menu on logout
//         router.push("/");
//         router.refresh();
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const handleDeleteAccount = async () => {
//       console.log("ised")

//       if (!user) {
//         console.error("No user is logged in.");
//         return;
//       }
  
//       try {
//         // Remove user data from Firebase Realtime Database
//         const userRef = ref(database, `usersData/${user.uid}`);
//         await remove(userRef);
//         console.log("ised")
//         // Delete the user from Firebase Authentication
//         const currentUser = auth.currentUser;
//         if (currentUser) {
//           await deleteUser(currentUser);
//           console.log("User deleted successfully.");
  
//           // Log out and redirect after deletion
//           await logOut();
//           router.push("/");
//         } else {
//           console.error("Current user is null.");
//         }
//       } catch (error) {
//         console.error("Error deleting account:", error.message);
//       }
//     };

//   return (
//     <div className='settings-data'>
//       <div className='settings-data-contents'>
//         <p>Export Data</p>
//         <div className='export-data'>
//           Export
//         </div>
//       </div>
//       <div className='settings-data-contents'>
//         <p>Delete all memory</p>
//         <div className='delete-all-memory'>
//           Delete
//         </div>
//       </div>
//       <div className='settings-data-contents'>
//         <p>Log out of all devices</p>
//         <div className='delete-account' onClick={handleLogOut}>
//           Log out
//         </div>
//       </div>
//       <div className='settings-data-contents'>
//         <p>Delete Account</p>
//         <div className='delete-account' onClick={handleDeleteAccount}>
//           Delete
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Data


import React, { useState } from 'react';
import { UserAuth } from '@context/AuthContext';
import { getAuth, deleteUser} from 'firebase/auth';
import { getDatabase, ref, remove } from 'firebase/database';
import { useRouter } from 'next/navigation';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const auth = getAuth();
const database = getDatabase();

const Data = () => {
  const { user, logOut } = UserAuth();
  const router = useRouter();
  const [hover, setHover] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogOut = async () => {
    try {
      console.log("Logout Working");
      await logOut();
      setHover(false);
      setMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };
  

  const handleDeleteAccount = async () => {
    if (!user) {
      console.error("No user is logged in.");
      return;
    }
  
    try {
      // Reauthenticate user if necessary
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("Current user is null, reauthentication might be required.");
        return;
      }
  
      // Remove user data from Firebase Realtime Database
      const userRef = ref(database, `usersData/${user.uid}`);
      await remove(userRef);
  
      // Delete the user from Firebase Authentication
      await deleteUser(currentUser);
  
      console.log("User deleted successfully.");
      await logOut();
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error.message);
    }
  };

  return (
    <div className="settings-data">
      <div className="settings-data-contents">
        <p>Export Data</p>
        <div className="export-data">Export</div>
      </div>
      <div className="settings-data-contents">
        <p>Delete all memory</p>
        <div className="delete-all-memory">Delete</div>
      </div>
      <div className="settings-data-contents">
        <p>Log out of all devices</p>
        <div className="delete-account" onClick={handleLogOut}>
          Log out
        </div>
      </div>
      <div className="settings-data-contents">
        <p>Delete Account</p>
        <div className="delete-account" onClick={handleDeleteAccount}>
          Delete
        </div>
      </div>
    </div>
  );
};

export default Data;
