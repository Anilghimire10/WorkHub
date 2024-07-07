import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./profile.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import newRequest from "../../utils/newRequest";

const App = () => {
  const backendURL = "http://localhost:8800";
  const currentUser = getCurrentUser();
  const userId = currentUser.userId;

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    createdAt: "",
    username: "",
    country: "",
    phonenumber: "",
    desc: "",
    img: "", // Ensure img is part of profile state
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: "",
    email: "",
    username: "",
    country: "",
    phonenumber: "",
    desc: "",
  });

  const [newProfilePicture, setNewProfilePicture] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await newRequest.get(`/user/${userId}`);
      if (response.data.success) {
        const userProfile = response.data.user;
        setProfile({
          ...userProfile,
          img: userProfile.img || "", // Ensure img is set or default to empty string
        });
        setEditProfile({
          email: userProfile.email,
          username: profile.username,
          country: userProfile.country,
          phonenumber: userProfile.phonenumber,
          desc: userProfile.desc,
        });
      } else {
        console.error("Error fetching profile:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePicture(URL.createObjectURL(file));
      setEditProfile((prevProfile) => ({
        ...prevProfile,
        img: file,
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("email", editProfile.email);
      formData.append("username", editProfile.username);
      formData.append("country", editProfile.country);
      formData.append("phonenumber", editProfile.phonenumber);
      formData.append("desc", editProfile.desc);
      if (editProfile.img instanceof File) {
        formData.append("img", editProfile.img);
      }

      // Capture the profile data before updating
      console.log("Profile before update:", profile);

      const response = await newRequest.put(`/user/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // Update the profile state with the updated data
        setProfile(response.data.user);
        // Capture the profile data after updating
        console.log("Profile after update:", response.data.user);

        closeModal(); // Close the modal after successful update
      } else {
        console.error("Error updating profile:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Ensure profile.img is defined before accessing it
  const profileImgSrc = profile.img
    ? `${backendURL}/uploads/${profile.img}`
    : "";

  return (
    <div className="profile-App">
      <header className="profile-App-header">
        <div className="profile-App-profile-box">
          <div className="profile-App-profilepic">
            {profile.img && ( // Check if profile.img is defined before rendering
              <img
                className="profile-App-profile-picture"
                src={`${backendURL}/uploads/${profile.img}`}
                alt="Profile"
              />
            )}
          </div>
          <h2>{profile.name}</h2>
          <div className="profile-App-details">
            <p>Email: {profile.email}</p>
            <p>Joined on: {profile.createdAt}</p>
            <p>Username: {profile.username}</p>
            <p>Country: {profile.country}</p>
            <p>Phone Number: {profile.phonenumber}</p>
          </div>
          <button className="profile-App-edit-button" onClick={openModal}>
            Edit Profile
          </button>
        </div>
        <div className="profile-App-editable-details">
          <div className="profile-App-edit-icon" onClick={openModal}>
            <i className="fas fa-pen"></i>
          </div>
          <div className="profile-App-details-box">
            <h3>Description</h3>
            <p>{profile.desc}</p>
          </div>
          <div className="profile-App-details-box">
            <h3>Languages</h3>
            <ul className="profile-App-details-content-list">
              <li>English</li>
              <li>Spanish</li>
              <li>French</li>
            </ul>
          </div>
        </div>
      </header>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="profile-Modal"
        overlayClassName="profile-Overlay"
      >
        <h2>Edit Profile</h2>
        <div className="profile-Modal-form-group">
          <label htmlFor="profilePictureInput">
            <img
              className="profile-Modal-modal-profile-picture"
              src={profileImgSrc} // Display current profile image in the modal
              alt="Profile"
            />
          </label>
          <input
            id="profilePictureInput"
            type="file"
            style={{ display: "none" }}
            onChange={handleProfilePictureChange}
          />
        </div>
        <form>
          {/* <div className="profile-Modal-form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={editProfile.name}
              onChange={handleChange}
            />
          </div> */}
          {/* <div className="profile-Modal-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={editProfile.email}
              onChange={handleChange}
            />
          </div> */}
          <div className="profile-Modal-form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={editProfile.username}
              onChange={handleChange}
            />
          </div>
          <div className="profile-Modal-form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={editProfile.country}
              onChange={handleChange}
            />
          </div>
          <div className="profile-Modal-form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phonenumber"
              value={editProfile.phonenumber}
              onChange={handleChange}
            />
          </div>
          <div className="profile-Modal-form-group">
            <label>Description</label>
            <textarea
              name="desc"
              value={editProfile.desc}
              onChange={handleChange}
            />
          </div>
          <button
            type="button"
            className="profile-Modal-update-button"
            onClick={handleUpdate}
          >
            Update
          </button>
        </form>
      </Modal>
    </div>
  );
};

Modal.setAppElement("#root");

export default App;
