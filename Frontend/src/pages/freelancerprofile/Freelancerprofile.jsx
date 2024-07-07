import React, { useState } from "react";
import Modal from "react-modal";
import "./freelancerprofile.scss";

const App = () => {
  const [profile, setProfile] = useState({
    name: "Rajiv Parajuli",
    email: "rajivprz@gmail.com",
    dateJoined: "2021-01-01",
    profilePicture: "https://via.placeholder.com/150",
    skills: [],
    education: [],
    certificates: [],
    languages: [],
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({ ...profile });
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

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...editProfile[field]];
    updatedArray[index] = value;
    setEditProfile((prevProfile) => ({
      ...prevProfile,
      [field]: updatedArray,
    }));
  };

  const handleAddItem = (field) => {
    if (field === "certificates") {
      const updatedArray = [...editProfile[field], { name: "", file: null }];
      setEditProfile((prevProfile) => ({
        ...prevProfile,
        [field]: updatedArray,
      }));
    } else {
      const updatedArray = [...editProfile[field], ""];
      setEditProfile((prevProfile) => ({
        ...prevProfile,
        [field]: updatedArray,
      }));
    }
  };

  const handleRemoveItem = (field, index) => {
    const updatedArray = [...editProfile[field]];
    updatedArray.splice(index, 1);
    setEditProfile((prevProfile) => ({
      ...prevProfile,
      [field]: updatedArray,
    }));
  };

  const handleFileChange = (field, index, file) => {
    const updatedArray = [...editProfile[field]];
    updatedArray[index].file = file;
    setEditProfile((prevProfile) => ({
      ...prevProfile,
      [field]: updatedArray,
    }));
  };

  const handleUpdate = () => {
    setProfile({ ...editProfile });
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
              {editProfile.languages.map((language, index) => (
                <li key={index}>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) =>
                      handleArrayChange("languages", index, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("languages", index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => handleAddItem("languages")}
                >
                  Add Language
                </button>
              </li>
            </ul>
          </div>
          <div className="profile-App-details-box">
            <h3>Skills</h3>
            <ul className="profile-App-details-content-list">
              {editProfile.skills.map((skill, index) => (
                <li key={index}>
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) =>
                      handleArrayChange("skills", index, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("skills", index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => handleAddItem("skills")}>
                  Add Skill
                </button>
              </li>
            </ul>
          </div>
          <div className="profile-App-details-box">
            <h3>Education</h3>
            <ul className="profile-App-details-content-list">
              {editProfile.education.map((edu, index) => (
                <li key={index}>
                  <input
                    type="text"
                    value={edu}
                    onChange={(e) =>
                      handleArrayChange("education", index, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("education", index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => handleAddItem("education")}
                >
                  Add Education
                </button>
              </li>
            </ul>
          </div>
          <div className="profile-App-details-box">
            <h3>Certificates</h3>
            <ul className="profile-App-details-content-list">
              {editProfile.certificates.map((cert, index) => (
                <li key={index}>
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange("certificates", index, e.target.files[0])
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("certificates", index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => handleAddItem("certificates")}
                >
                  Add Certificate
                </button>
              </li>
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
