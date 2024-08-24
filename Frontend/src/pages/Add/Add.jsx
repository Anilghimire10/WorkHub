import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import newRequest from "../../utils/newRequest";
import "./add.scss";

const Add = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [uploadImages, setUploadImages] = useState([]);
  const [desc, setDesc] = useState("");
  const [shortTitle, setShortTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [revisionNumber, setRevisionNumber] = useState("");
  const [revisionTime, setRevisionTime] = useState("");
  const [features, setFeatures] = useState([]);
  const [price, setPrice] = useState("");

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleMultipleFileChange = (e) => {
    setUploadImages(e.target.files);
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to create this gig?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("cover", coverImage);
      Array.from(uploadImages).forEach((image) => {
        formData.append("images", image);
      });
      formData.append("desc", desc);
      formData.append("shortTitle", shortTitle);
      formData.append("shortDesc", shortDesc);
      formData.append("deliveryTime", deliveryTime);
      formData.append("revisionNumber", revisionNumber);
      formData.append("revisionTime", revisionTime);
      formData.append("features", JSON.stringify(features));
      formData.append("price", price);

      try {
        const response = await newRequest.post("gig/new", formData);
        console.log(response.data);

        await Swal.fire({
          title: "Gig created successfully!",
          icon: "success",
        });
        navigate("/mygigs");
      } catch (error) {
        console.error("Error adding gig:", error);
        Swal.fire("Failed to create gig!", "Something went wrong.", "error");
      }
    } else {
      Swal.fire("Gig creation canceled!", "", "info");
    }
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <form onSubmit={handleSubmit}>
          <div className="sections">
            <div className="info">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                placeholder="e.g. I will do something I'm really good at"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="category">Category</label>
              <select
                name="cats"
                id="cats"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="design">Design</option>
                <option value="web">Web Development</option>
                <option value="animation">Animation</option>
                <option value="music">Music</option>
              </select>
              <label htmlFor="cover">Cover Image</label>
              <input type="file" onChange={handleFileChange} />
              <label htmlFor="images">Upload Images</label>
              <input type="file" multiple onChange={handleMultipleFileChange} />
              <label htmlFor="desc">Description</label>
              <textarea
                name="desc"
                id="desc"
                placeholder="Brief descriptions to introduce your service to customers"
                cols="0"
                rows="16"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              ></textarea>
            </div>
            <div className="details">
              <label htmlFor="shortTitle">Short Title</label>{" "}
              <input
                type="text"
                placeholder="e.g. One-page web design"
                value={shortTitle}
                onChange={(e) => setShortTitle(e.target.value)}
              />
              <label htmlFor="shortDesc">Short Description</label>
              <textarea
                name="shortDesc"
                id="shortDesc"
                placeholder="Short description of your service"
                cols="30"
                rows="10"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
              ></textarea>
              <label htmlFor="deliveryTime">Delivery Time (e.g. 3 days)</label>
              <input
                type="number"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
              />
              <label htmlFor="revisionNumber">Revision Number</label>
              <input
                type="number"
                value={revisionNumber}
                onChange={(e) => setRevisionNumber(e.target.value)}
              />
              <label htmlFor="revisionTime">Revision Time</label>{" "}
              <input
                type="text"
                placeholder="e.g. 1 day"
                value={revisionTime}
                onChange={(e) => setRevisionTime(e.target.value)}
              />
              <label htmlFor="price">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <label htmlFor="features">Add Features</label>
              {features.map((feature, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Feature ${index + 1}`}
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                />
              ))}
              <button type="button" onClick={handleAddFeature}>
                Add Feature
              </button>
            </div>
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
