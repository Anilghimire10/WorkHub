import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./message.scss";

const Message = () => {
  const { id } = useParams();
  // console.log("ID:", id);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  // console.log("Current User:", currentUser);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      newRequest.get(`message/${id}`).then((res) => {
        console.log("Fetched messages data:", res.data);
        return res.data.message;
      }),
  });

  const mutation = useMutation({
    mutationFn: (message) => {
      console.log("Sending message:", message);
      return newRequest.post(`message`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Extracting values from the form
    const textareaValue = e.target[0].value;

    // Creating the message object
    const message = {
      conversationId: id,
      desc: textareaValue,
    };

    // Logging details for debugging
    console.log("Form submission event:", e);
    console.log("Conversation ID from URL:", id);
    console.log("Textarea value before sending:", textareaValue);
    console.log("Message object created:", message);

    // Mutating the message
    mutation.mutate(message);

    // Clearing the textarea
    e.target[0].value = "";
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link>
        </span>
        {isLoading ? (
          "loading"
        ) : error ? (
          "error"
        ) : (
          <div className="messages">
            {data.map((m) => (
              <div
                className={
                  m.userId === currentUser.userId ? "owner item" : "item"
                }
                key={m._id}
              >
                <img
                  src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        )}
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="write a message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
