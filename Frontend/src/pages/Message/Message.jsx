import React from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./message.scss";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      newRequest.get(`message/${id}`).then((res) => res.data.message),
  });

  const mutation = useMutation({
    mutationFn: (message) => newRequest.post(`message`, message),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const textareaValue = e.target[0].value;
    const message = {
      conversationId: id,
      desc: textareaValue,
    };
    mutation.mutate(message);
    e.target[0].value = "";
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link>
        </span>
        {isLoading ? (
          "Loading..."
        ) : error ? (
          "Error occurred"
        ) : (
          <div className="messages">
            {data.map((m) => (
              <div
                className={
                  m.userId === currentUser.userId ? "owner item" : "item"
                }
                key={m._id}
              >
                {m.userId !== currentUser.userId && (
                  <img
                    src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt="User"
                  />
                )}
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        )}
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="Write a message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
