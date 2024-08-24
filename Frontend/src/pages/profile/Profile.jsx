import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import "./profile.scss";

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
    img: "",
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: "",
    email: "",
    username: "",
    country: "",
    phonenumber: "",
    desc: "",
    img: null,
  });

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
          img: userProfile.img || "",
        });
        setEditProfile({
          name: userProfile.name,
          email: userProfile.email,
          username: userProfile.username,
          country: userProfile.country,
          phonenumber: userProfile.phonenumber,
          desc: userProfile.desc,
          img: null,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
        formData.append("name", editProfile.name);
        formData.append("email", editProfile.email);
        formData.append("username", editProfile.username);
        formData.append("country", editProfile.country);
        formData.append("phonenumber", editProfile.phonenumber);
        formData.append("desc", editProfile.desc);
        if (editProfile.img) {
          formData.append("img", editProfile.img);
        }

        const response = await newRequest.put(`user/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          setProfile(response.data.user);
          closeModal();
          Swal.fire({
            title: 'Profile Updated',
            text: 'Your profile has been successfully updated.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          console.error("Error updating profile:", response.data.message);
        }
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

  const profileImgSrc = profile.img
    ? `${backendURL}/uploads/images/${profile.img}`
    : "";

  return (
    <div className="profile-App">
      <header className="profile-App-header">
        <div className="profile-App-profile-box">
          <div className="profile-App-profilepic">
            {profile.img && (
              <img
                className="profile-App-profile-picture"
                src={profileImgSrc}
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
        <form>
          <div className="profile-Modal-form-group">
            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {editProfile.img && (
              <img
                className="profile-Modal-preview-image"
                src={URL.createObjectURL(editProfile.img)}
                alt="Profile Preview"
              />
            )}
          </div>
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
