import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import TrackingPath from "./TrackingPath";

const firebaseConfig = {
  apiKey: "AIzaSyB3vFmUkVuYXeb5CgHKQVtPNq1CLu_fC1I",
  authDomain: "skoegle.firebaseapp.com",
  databaseURL: "https://skoegle-default-rtdb.firebaseio.com",
  projectId: "skoegle",
  storageBucket: "skoegle.appspot.com",
  messagingSenderId: "850483861138",
  appId: "1:850483861138:web:7db6db38eb81eb3dde384b",
  measurementId: "G-9SB0PX663B",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const LiveGPSTracker = () => {
  const [logsData, setLogsData] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const dataRef = ref(database, "Logs");

      onValue(dataRef, (snapshot) => {
        const logs = snapshot.val();
        if (logs) {
          const organizedData = Object.keys(logs).map((key) => {
            const { timestamp } = logs[key];
            const [date, time, lat, lng] = timestamp.split(",");
            return { lat, lng, time, date };
          });
          setLogsData(organizedData);
        }
      });
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h1>Skoegle - GPS Path Tracker</h1>
      <TrackingPath logsData={logsData} />
    </div>
  );
};

export default LiveGPSTracker;
