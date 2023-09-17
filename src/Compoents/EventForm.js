import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { listAction } from "../redux-store/list-slice";

import classes from "./EventForm.module.css";

const EventForm = () => {
  const nameInputRef = useRef();
  const dateInputRef = useRef();
  const durInputRef = useRef();
  const desInputRef = useRef();
  const emailInputRef = useRef();
  const formRef = useRef();

  const userData = useSelector((state) => state.eventListStore);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(userData);

  const submitHandler = async (e) => {
    e.preventDefault();

    const eventName = nameInputRef.current.value;
    const dateTime = dateInputRef.current.value;
    const duration = durInputRef.current.value;
    const des = desInputRef.current.value;

    const eventData = {
      eventName: eventName,
      dateTime: dateTime,
      duration: duration,
      description: des,
    };

    // console.log(eventData);
    try {
      const email = emailInputRef.current.value.replace(/[.@]/g, "");
      let response;
      if (userData.editId == null) {
        response = await fetch(
          `https://kamtech-task-default-rtdb.firebaseio.com/${email}.json`,
          {
            method: "POST",
            body: JSON.stringify({
              ...eventData,
            }),
            headers: {
              "content-type": "application/json",
            },
          }
        );
      } else {
        navigate("/event-list");
        response = await fetch(
          `https://kamtech-task-default-rtdb.firebaseio.com/${email}/${userData.editId[0]}.json`,
          {
            method: "PUT",
            body: JSON.stringify({
              ...eventData,
            }),
            headers: {
              "content-type": "application/json",
            },
          }
          
        );
        dispatch(listAction.removeEditId());
        
      }

      if (!response.ok) {
        throw new Error("Failed to save");
      } else {
        alert('Succesfully added.')
        formRef.current.reset();
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const cancelHandler = () => {
    dispatch(listAction.removeEditId());
    navigate("/event-list");
  };

  return (
    <form ref={formRef} className={classes.formCon}>
      {userData.editId == null ? (
        <h1>Event Schedule</h1>
      ) : (
        <h1>Edit Event Schedule</h1>
      )}
      <span>
        <label>Email:</label>
        <input
          type="email"
          placeHolder="xyz@mail.com"
          ref={emailInputRef}
          defaultValue={userData.editId !== null ? userData.userEmail : ""}
          required
        />
      </span>
      <span>
        <label>Event Name:</label>
        <input
          type="text"
          placeHolder="Event Name"
          ref={nameInputRef}
          defaultValue={
            userData.editId !== null ? userData.editId[1].eventName : ""
          }
          required
        />
      </span>
      <span>
        <label>Date:</label>
        <input
          type="datetime-local"
          ref={dateInputRef}
          defaultValue={
            userData.editId !== null ? userData.editId[1].dateTime : ""
          }
          required
        />
      </span>
      <span>
        <label>Duration:</label>
        <input
          type="number"
          placeholder="In minutes"
          ref={durInputRef}
          defaultValue={
            userData.editId !== null ? userData.editId[1].duration : ""
          }
          required
        />
      </span>
      <span>
        <label>Description:</label>
        <input
          className={classes.textArea}
          type="textarea"
          ref={desInputRef}
          defaultValue={
            userData.editId !== null ? userData.editId[1].description : ""
          }
          required
        />
      </span>
      <div className={classes.btnCon}>
        <button onClick={submitHandler}>Save</button>
        {userData.editId !== null && (
          <button style={{ backgroundColor: "red" }} onClick={cancelHandler}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EventForm;
