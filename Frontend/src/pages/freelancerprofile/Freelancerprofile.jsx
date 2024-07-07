import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./freelancerprofile.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import newRequest from "../../utils/newRequest";

const App = () => {
  const backendURL = "http://localhost:8800";
  const currentUser = getCurrentUser();
  const userId = currentUser.userId;

  const initialProfileState = {
    username: "",
    email: "",
    createdAt: "",
    img: "",
    skills: [],
    education: [],
    certificates: [],
    languages: [],
    desc: "",
  };

  const [profile, setProfile] = useState(initialProfileState);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({ ...initialProfileState });
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await newRequest.get(`user/${userId}`);
      const fetchedProfile = response.data;
      console.log("Fetched Profile Data:", fetchedProfile);
      setProfile(fetchedProfile);
      setEditProfile({ ...fetchedProfile });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
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
      Object.keys(editProfile).forEach((key) => {
        if (key === "img" && editProfile[key] instanceof File) {
          formData.append(key, editProfile[key]);
        } else {
          formData.append(key, JSON.stringify(editProfile[key]));
        }
      });

      const response = await newRequest.put(`user/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile Update Response:", response.data);
      setProfile({ ...editProfile });
      closeModal();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  // Function to format createdAt date to display only the date part
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="profile-App">
      <header className="profile-App-header">
        <div className="profile-App-profile-box">
          <div className="profile-App-profilepic">
            <img
              className="profile-App-profile-picture"
              src={`${backendURL}/uploads/${profile.user.img}`}
              alt="Profile"
            />
          </div>
          <h2>{profile.user.username}</h2>
          <div className="profile-App-details">
            <p>Email : {profile.user.email}</p>
            <p>Joined on: {formatDate(profile.user.createdAt)}</p>
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
            <p>{profile.user.desc}</p>
          </div>
          <div className="profile-App-details-box">
            <h3>Languages</h3>
            <ul className="profile-App-details-content-list">
              {/* {profile.languages.map((language, index) => (
                <li key={index}>{language}</li>
              ))} */}
            </ul>
          </div>
          <div className="profile-App-details-box">
            <h3>Skills</h3>
            <ul className="profile-App-details-content-list">
              {/* {profile.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))} */}
            </ul>
          </div>
          <div className="profile-App-details-box">
            <h3>Education</h3>
            <ul className="profile-App-details-content-list">
              {/* {profile.education.map((edu, index) => (
                <li key={index}>{edu}</li>
              ))} */}
            </ul>
          </div>
          <div className="profile-App-details-box">
            <h3>Certificates</h3>
            <ul className="profile-App-details-content-list">
              {/* {profile.certificates.map((cert, index) => (
                <li key={index}>{cert.name}</li>
              ))} */}
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
              src={newProfilePicture || `${backendURL}/uploads/${profile.img}`}
              alt="Profile"
            />
            <input
              type="file"
              id="profilePictureInput"
              onChange={handleProfilePictureChange}
            />
          </label>
        </div>
        <div className="profile-Modal-form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={editProfile.username}
            onChange={handleChange}
          />
        </div>
        <div className="profile-Modal-form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={editProfile.email}
            onChange={handleChange}
          />
        </div>
        <div className="profile-Modal-form-group">
          <label htmlFor="desc">Description</label>
          <textarea
            id="desc"
            name="desc"
            value={editProfile.desc}
            onChange={handleChange}
          />
        </div>
        <button className="profile-Modal-save-button" onClick={handleUpdate}>
          Save Changes
        </button>
        <button className="profile-Modal-cancel-button" onClick={closeModal}>
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default App;
