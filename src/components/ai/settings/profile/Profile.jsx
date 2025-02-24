'use client'
import React, { useState, useRef, useEffect } from 'react';
import '@styles/ai/settings/Profile.css';
import Image from 'next/image';
import edit from '@public/Images/ai/settings/edit.svg';
import linkedin from '@public/Images/ai/settings/linkedin.svg';
import x from '@public/Images/ai/settings/x.svg';
import { UserAuth } from '@context/AuthContext';
import { ref, set, get, getDatabase } from 'firebase/database';
// Correct consolidated import
import { database } from '@firebase';


const Profile = () => {
  const [linkOpen, setLinkOpen] = useState({ linkedin: false, x: false });
  const [links, setLinks] = useState({ linkedin: '', x: '' });
  const [editingLinks, setEditingLinks] = useState({ linkedin: false, x: false }); // Track editing state
  const [editState, setEditState] = useState({ name: false, phone: false });
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [inputValue, setInputValue] = useState({ name: '', phone: '' });
  const linkedinRef = useRef(null);
  const xRef = useRef(null);
  const {user} = UserAuth()

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (user?.uid) {
  //       const userRef = ref(database, `usersData/${user.uid}`);
  //       const snapshot = await get(userRef);
  //       if (snapshot.exists()) {
  //         const data = snapshot.val();
  //         setProfileData({ name: data.name || '', phone: data.phone || '' });
  //         setLinks({ linkedin: data.linkedin || '', x: data.x || '' });
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        const userRef = ref(database, `usersData/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Extract the name from the email if the name is not provided
          const emailName = user.email?.split('@')[0] || '';
          const name = data.name || emailName; // Use email name as default
          setProfileData({
            name,
            phone: data.phone || '',
          });
          setLinks({
            linkedin: data.linkedin || '',
            x: data.x || '',
          });
  
          // Save the default name to Firebase if it wasn't already set
          if (!data.name && emailName) {
            await set(userRef, { ...data, name: emailName });
          }
        }
      }
    };
  
    fetchData();
  }, [user]);
  
  

 const handleEditToggle = (field) => {
    setEditState((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
    setInputValue((prevInput) => ({
      ...prevInput,
      [field]: profileData[field],
    }));
  };

  const handleCancel = (field) => {
    setEditState((prevState) => ({
      ...prevState,
      [field]: false,
    }));
  };

  
  

  const handleAddOrEditLinkClick = (field) => {
    setLinkOpen((prevState) => ({
      ...prevState,
      [field]: true,
    }));
    setEditingLinks((prevState) => ({
      ...prevState,
      [field]: !!links[field], // Set editing state if the link exists
    }));
  };

  const handleCancelLink = (field) => {
    setLinkOpen((prevState) => ({
      ...prevState,
      [field]: false,
    }));
    setEditingLinks((prevState) => ({
      ...prevState,
      [field]: false,
    }));
  };

  
  const saveToDatabase = async (data) => {
    if (user?.uid) {
      const userRef = ref(database, `usersData/${user.uid}`);
      const dataWithUserInfo = {
        ...data,
        userId: user.uid,
        email: user.email || '', // Include email if available
      };
      await set(userRef, dataWithUserInfo);
      console.log('Data saved to Firebase:', dataWithUserInfo);
    }
  };
  
  const handleSave = (field) => {
    const updatedData = { ...profileData, [field]: inputValue[field] };
    setProfileData(updatedData);
    saveToDatabase({ ...updatedData, ...links });
    setEditState((prevState) => ({ ...prevState, [field]: false }));
  };
  
  const handleSaveLink = (field, ref) => {
    const updatedLinks = { ...links, [field]: ref.current.value };
    setLinks(updatedLinks);
    saveToDatabase({ ...profileData, ...updatedLinks });
    setLinkOpen((prevState) => ({ ...prevState, [field]: false }));
    setEditingLinks((prevState) => ({ ...prevState, [field]: false }));
  };
  

  return (
    <div className="settings-profile">
      <div className="settings-profile-container">

             <div className="settings-profile-credentials">
          
           <div className="settings-profile-credentials-contents">
             <div className="profile-credentials-title">Name</div>
            <div className="profile-credentials-edit">
              {!editState.name && (
                <div className="profile-credentials-editing">
                  <p>{profileData.name || ''}</p>
                  <Image
                    src={edit}
                    // onClick={() => handleEditToggle('name')}
                    onClick={() => setEditState({ ...editState, name: true })}
                    height={14}
                    alt="Edit"
                  />
                </div>
              )}
              {editState.name && (
                <div className="profile-credentials-save">
                  <input
                    className="profile-credentials-save-input"
                    value={inputValue.name}
                    onChange={(e) =>
                      setInputValue({ ...inputValue, name: e.target.value })
                    }
                  />
                  <div className="profile-credentials-save-button">
                    <button
                      className="profile-save-btn"
                      onClick={() => handleSave('name')}
                    >
                      Save
                    </button>
                    <button
                      className="profile-cancel-btn"
                      // onClick={() => handleCancel('name')}
                      onClick={() => setEditState({ ...editState, name: false })}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="settings-profile-credentials-contents">
             <div className="profile-credentials-title">Email</div>
             <div className="profile-credentials-edit">
               <div className="profile-credentials-editing">
                 <p>{user?.email || ''}</p>
               </div>
            </div>
           </div>

          {/* Phone Number Field */}
          <div className="settings-profile-credentials-contents" id="profile-phone-number">
            <div className="profile-credentials-title">Phone Number</div>
            <div className="profile-credentials-edit">
              {!editState.phone && (
                <div className="profile-credentials-editing">
                  <p>{profileData.phone || ''}</p>
                  <Image src={edit} 
                  // onClick={() => handleEditToggle('phone')}
                  onClick={() => setEditState({ ...editState, phone: true })}
                   height={14} alt="Edit"/>
                </div>
              )}
              {editState.phone && (
                <div className="profile-credentials-save">
                  <input className="profile-credentials-save-input" value={inputValue.phone} onChange={(e) =>
                      setInputValue({ ...inputValue, phone: e.target.value })
                    }
                  />
                  <div className="profile-credentials-save-button">
                    <button className="profile-save-btn" onClick={() => handleSave('phone')} >
                      Save
                    </button>
                    <button className="profile-cancel-btn" 
                    // onClick={() => handleCancel('phone')}
                    onClick={() => setEditState({ ...editState, phone: false })} 
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="settings-profile-links">
          <div className="settings-profile-links-title">
            <p>Links</p>
          </div>
          <div className="settings-profile-links-social">
            {/* LinkedIn */}
            <div className="settings-profile-links-social-container">
              <div className="settings-profile-links-social-title">
                <Image src={linkedin} alt="Social Icon" height={14} />
                <p>LinkedIn</p>
              </div>
              {links.linkedin && !linkOpen.linkedin ? (
                <div className="profile-credentials-editing">
                  <p>{links.linkedin}</p>
                  <Image
                    src={edit}
                    onClick={() => handleAddOrEditLinkClick('linkedin')}
                    height={14}
                    alt="Edit"
                  />
                </div>
              ) : (
                !linkOpen.linkedin && (
                  <button
                    className="social-links-add"
                    onClick={() => handleAddOrEditLinkClick('linkedin')}
                  >
                    Add
                  </button>
                )
              )}
              {linkOpen.linkedin && (
                <div className="profile-credentials-save">
                  <input
                    ref={linkedinRef}
                    className="profile-credentials-save-input"
                    defaultValue={editingLinks.linkedin ? links.linkedin : ''}
                    placeholder="Enter LinkedIn link"
                  />
                  <div className="profile-credentials-save-button">
                    <button
                      className="profile-save-btn"
                      onClick={() => handleSaveLink('linkedin', linkedinRef)}
                    >
                      Save
                    </button>
                    <button
                      className="profile-cancel-btn"
                      onClick={() => handleCancelLink('linkedin')}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* X */}
            <div className="settings-profile-links-social-container">
              <div className="settings-profile-links-social-title">
                <Image src={x} alt="Social Icon" height={14} />
                <p>X</p>
              </div>
              {links.x && !linkOpen.x ? (
                <div className="profile-credentials-editing">
                  <p>{links.x}</p>
                  <Image
                    src={edit}
                    onClick={() => handleAddOrEditLinkClick('x')}
                    height={14}
                    alt="Edit"
                  />
                </div>
              ) : (
                !linkOpen.x && (
                  <button
                    className="social-links-add"
                    onClick={() => handleAddOrEditLinkClick('x')}
                  >
                    Add
                  </button>
                )
              )}
              {linkOpen.x && (
                <div className="profile-credentials-save">
                  <input
                    ref={xRef}
                    className="profile-credentials-save-input"
                    defaultValue={editingLinks.x ? links.x : ''}
                    placeholder="Enter X link"
                  />
                  <div className="profile-credentials-save-button">
                    <button
                      className="profile-save-btn"
                      onClick={() => handleSaveLink('x', xRef)}
                    >
                      Save
                    </button>
                    <button
                      className="profile-cancel-btn"
                      onClick={() => handleCancelLink('x')}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

