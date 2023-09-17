import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router";
import "./App.css";
import EventForm from "./Compoents/EventForm";
import EventList from "./Compoents/EventList";
import { listAction } from "./redux-store/list-slice";

function App() {
  const userData = useSelector((state) => state.eventListStore);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const restoreData = async () => {
    if (userData.user) {
      const email2 = userData.userEmail.replace(/[.@]/g, "");
      try {
        const res = await fetch(
          `https://kamtech-task-default-rtdb.firebaseio.com/${email2}.json`
        );

        const data = await res.json();
        // console.log(data);
        // setList(Object.entries(data));
        dispatch(listAction.setEventList(Object.entries(data)));
      } catch (error) {
        alert(error);
      }
    }
  };

  useEffect(() => {
    restoreData();
  }, []);

  setTimeout(() => {
    restoreData();
  }, 2000);

  return (
    <div className="App">
      <Button variant="primary" onClick={() => navigate("/")}>
        Event Schedule
      </Button>{" "}
      <Button variant="secondary" onClick={() => navigate("/event-list")}>
        Scheduled Events
      </Button>
      <Routes>
        <Route path="/" element={<EventForm />} />
        <Route path="/event-list" element={<EventList />} />
      </Routes>
    </div>
  );
}

export default App;
