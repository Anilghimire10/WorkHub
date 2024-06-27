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
    <div className="profile-App">
      <header className="profile-App-header">
        <div className="profile-App-profile-box">
          <div className="profile-App-profilepic">
            <img
              className="profile-App-profile-picture"
              src={profile.profilePicture}
              alt="Profile"
            />
          </div>
          <h2>{profile.name}</h2>
          <div className="profile-App-details">
            <p>Email : {profile.email}</p>
            <p>Joined on: {profile.dateJoined}</p>
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
            <p>Description text goes here...</p>
          </div>
          <div className="profile-App-details-box">
            <h3>Languages</h3>
            <ul className="profile-App-details-content-list">
              <li>English</li>
              <li>Spanish</li>
              <li>French</li>
            </ul>
          </div>
          <div className="profile-App-details-box">
            <h3>Skills</h3>
            <ul className="profile-App-details-content-list">
              <li>JavaScript</li>
              <li>React</li>
              <li>Node.js</li>
            </ul>
          </div>
          <div className="profile-App-details-box">
            <h3>Education</h3>
            <p>Education details go here...</p>
          </div>
          <div className="profile-App-details-box">
            <h3>Certificates</h3>
            <ul className="profile-App-details-content-list">
              <li>Certificate 1</li>
              <li>Certificate 2</li>
              <li>Certificate 3</li>
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
          <div className="profile-Modal-form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={editProfile.name}
              onChange={handleChange}
            />
          </div>
          <div className="profile-Modal-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={editProfile.email}
              onChange={handleChange}
            />
          </div>
          <div className="profile-Modal-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
          <div className="profile-Modal-form-group">
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
