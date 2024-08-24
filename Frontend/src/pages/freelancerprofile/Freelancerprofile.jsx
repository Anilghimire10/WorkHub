import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import "./freelancerprofile.scss";

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
      const response = await newRequest.get(`/user/${userId}`);
      const fetchedProfile = response.data.user;
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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update the profile?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const formData = new FormData();
        Object.keys(editProfile).forEach((key) => {
          if (key === "img" && editProfile[key] instanceof File) {
            formData.append(key, editProfile[key]);
          } else {
            formData.append(key, editProfile[key]);
          }
        });

        const response = await newRequest.put(`user/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Profile Update Response:", response.data);
        setProfile(response.data.user);
        closeModal();
        Swal.fire({
          title: 'Profile Updated',
          text: 'Your profile has been successfully updated.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while updating the profile. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
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
              src={
                profile.img
                  ? `${backendURL}/uploads/images/${profile.img}`
                  : `${backendURL}/uploads/images/default-profile.png`
              }
              alt="Profile"
            />
          </div>
          <h2>{profile.username}</h2>
          <div className="profile-App-details">
            <p>Email: {profile.email}</p>
            <p>Joined on: {formatDate(profile.createdAt)}</p>
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
          {/* Add more profile details sections as needed */}
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
              src={
                newProfilePicture ||
                `${backendURL}/uploads/images/${profile.img}`
              }
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
        <button
          type="button"
          className="profile-Modal-update-button"
          onClick={handleUpdate}
        >
          Update
        </button>
      </Modal>
    </div>
  );
};

export default App;
