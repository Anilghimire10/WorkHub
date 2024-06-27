import React, { useState } from "react";
import Modal from "react-modal";
import "./profile.scss";

const App = () => {
  const [profile, setProfile] = useState({
    name: "Rajiv Parajuli",
    email: "rajivprz@gmail.com",
    dateJoined: "2021-01-01",
    profilePicture: "https://via.placeholder.com/150",
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editProfile, setEditProfile] = useState(profile);
  const [newProfilePicture, setNewProfilePicture] = useState(null);

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
        profilePicture: file,
      }));
    }
  };

  const handleUpdate = () => {
    setProfile((prevProfile) => ({
      ...editProfile,
      profilePicture: newProfilePicture || prevProfile.profilePicture,
    }));
    closeModal();
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="profile-box">
          <div className="profilepic">
            <img
              className="profile-picture"
              src={profile.profilePicture}
              alt="Profile"
            />
          </div>
          <h2>{profile.name}</h2>
          <div className="details">
            <p>Email : {profile.email}</p>
            <p>Joined on: {profile.dateJoined}</p>
          </div>
          <button className="edit-button" onClick={openModal}>
            Edit Profile
          </button>
        </div>
      </header>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Edit Profile</h2>
        <div className="form-group">
          <label htmlFor="profilePictureInput">
            <img
              className="modal-profile-picture"
              src={newProfilePicture || profile.profilePicture}
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
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={editProfile.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={editProfile.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>
          <button
            type="button"
            className="update-button"
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
