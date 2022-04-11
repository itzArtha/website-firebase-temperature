import { useState, useEffect } from "react";
import React from "react";
import fs from "./config.js";

function App() {
  const database = fs.database();
  const [monitoring, setMonitoring] = useState({
    Humidity: "0",
    Temperature: "0",
  });
  const [log, setLog] = useState([]);
  const [lampu1, setLampu1] = useState(true);
  const getMonitoring = () => {
    database
        .ref("/Monitoring")
        .once("value")
        .then((snapshot) => {
          console.log("inidata ", snapshot.val());
          setMonitoring({
            Humidity: snapshot.val().Humidity,
            Temperature: snapshot.val().Temperature,
          });
        });
  };
  const getLogList = () => {
    database
        .ref("/log")
        .once("value")
        .then((snapshotquerry) => {
          let list = [];
          snapshotquerry.forEach((snapshot) => {
            console.log(snapshot)
            list.push(snapshot);
          });
          setLog(list);
        });
  };
  const controlLampu = () => {
    let statusnow = lampu1 ? "0" : "1";
    database
        .ref("Control")
        .update({ relay1: statusnow })
        .catch((e) => console.log(e));
    checkLampu();
  };
  const checkLampu = () => {
    database
        .ref("Control")
        .once("value")
        .then((snapshot) => {
          console.log(snapshot.toJSON().relay1);
          if (snapshot.toJSON().relay1 === "1") {
            setLampu1(true);
          } else {
            setLampu1(false);
          }
        });
  };
  useEffect(() => {
    const getData = checkLampu();
      getLogList()

    return getData;
  }, []);
  useEffect(() => {
    const getData = getMonitoring();

    return getData;
  }, []);

  return (
      <div>
        <h1>{monitoring.Temperature} C</h1>
        <h1>{monitoring.Humidity} %</h1>
        <h1>History</h1>
      </div>
  );
}

export default App;