import React, { useState, useRef } from "react";

import Table from "react-bootstrap/Table";
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineOrderedList,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { SlCalender } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { listAction } from "../redux-store/list-slice";

import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

import classes from "./EventList.module.css";

const EventList = () => {
  const email2InputRef = useRef();

  const userData = useSelector((state) => state.eventListStore);
  const list = userData.eventList;

  console.log(list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [calendarView, setCalView] = useState(false);

  const fetchHandler = async (e) => {
    e.preventDefault();
    dispatch(listAction.setUserEmail(email2InputRef.current.value));

    const email2 = email2InputRef.current.value.replace(/[.@]/g, "");

    try {
      const res = await fetch(
        `https://kamtech-task-default-rtdb.firebaseio.com/${email2}.json`
      );

      const data = await res.json();
      console.log(data);
      // setList(Object.entries(data));
      dispatch(listAction.setEventList(Object.entries(data)));
      dispatch(listAction.setUserTrue());
      setTimeout(() => {
        dispatch(listAction.clearAllStore());
        dispatch(listAction.setUserFalse());
      }, 180000);
    } catch (error) {
      alert(error);
    }
  };

  const deleteHandler = async (id) => {
    const email2 = userData.userEmail.replace(/[.@]/g, "");
    try {
      const res = await fetch(
        `https://kamtech-task-default-rtdb.firebaseio.com/${email2}/${id}.json`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Deletion Faild");
      } else {
        const filterList = list.filter((ele) => ele[0] !== id);
        dispatch(listAction.setEventList(filterList));
      }
    } catch (error) {
      alert(error);
    }
  };

  const editHandler = (event) => {
    dispatch(listAction.setEditId(event));
    navigate("/");
  };
  const clearHandler = () => {
    dispatch(listAction.clearAllStore());
    dispatch(listAction.setUserFalse());
  };

  const compareDates = (eventA, eventB) => {
    const dateA = new Date(eventA[1].dateTime);
    const dateB = new Date(eventB[1].dateTime);

    return dateA - dateB;
  };

  const sortedList = [...list].sort(compareDates);
  console.log(sortedList);

  const localizer = momentLocalizer(moment);

  const calendarEvents = sortedList.map((event) => ({
    title: event[1].eventName,
    start: new Date(event[1].dateTime),
    end: new Date(event[1].dateTime).getTime() + event[1].duration * 60 * 1000,
  }));

  return (
    <div className={classes.eventCon}>
      {!userData.user ? (
        <form onSubmit={fetchHandler}>
          <input
            type="email"
            placeholder="Email"
            required
            ref={email2InputRef}
          />
          <button>Get Your Events</button>
        </form>
      ) : (
        <div className={classes.headCon}>
          <button onClick={clearHandler}>Reset</button>
          <h5>Hello! {userData.userEmail}</h5>
          <section>
            <h6>Your Scheduled Events</h6>
            <button
              style={{ backgroundColor: "blue" }}
              onClick={() => setCalView((prev) => !prev)}
            >
              {!calendarView ? <SlCalender /> : <AiOutlineUnorderedList />}
            </button>
          </section>
        </div>
      )}
      {userData.user && !calendarView && (
        <Table hover className={classes.eventList}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Event Name</th>
              <th>Description</th>
              <th>Date & Time</th>
              <th>Duration (In mins)</th>
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedList.map((i, idx) => (
              <tr key={i[0]}>
                <td>{idx + 1}</td>
                <td>{i[1].eventName}</td>
                <td>{i[1].description}</td>
                <td>
                  {new Date(i[1].dateTime).toLocaleDateString()}{" "}
                  {new Date(i[1].dateTime).toLocaleTimeString()}
                </td>
                <td>{i[1].duration}</td>
                <td>
                  <AiFillEdit
                    onClick={() => editHandler(i)}
                    style={{ color: "gray" }}
                  />
                </td>
                <td>
                  <AiFillDelete
                    onClick={() => deleteHandler(i[0])}
                    style={{ color: "red" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {userData.user && calendarView && (
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ marginBottom: "20px" }}
        />
      )}
      {!userData.user && <p>Please enter email!</p>}
    </div>
  );
};

export default EventList;
