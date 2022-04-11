import { useState, useEffect } from "react";
import React from "react";
import fs from "./config.js";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

function App() {
    useEffect(() => {
        const getData = checkLampu();

        return getData;
    }, []);
    useEffect(() => {
        const getData = getLogList();

        return getData;
    }, []);
    useEffect(() => {
        const getData = getMonitoring();

        return getData;
    }, []);
  const database = fs.database();

  const [monitoring, setMonitoring] = useState({
    Humidity: "0",
    Temperature: "0",
  });
    Chart.register(...registerables);
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
        .orderByChild("TIMESTAMP")
        .once("value")
        .then((snapshotquerry) => {
          let list = [];
          snapshotquerry.forEach((snapshot) => {
            list.push(snapshot.val());
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

    const temperatures = {
        labels:  log.slice(0, 5).map((item) => item.TIMESTAMP),
        datasets: [
            {
                label: 'Temperature',
                backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)",
                ],
                data: log.slice(0, 5).map((item) => item.Temperature),
            },
            {
                label: 'Humidity',
                backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)",
                ],
                data: log.slice(0, 5).map((item) => item.Humidity),
            },
        ],
    };

  return (
      <div>
        <h1>{monitoring.Temperature} C</h1>
        <h1>{monitoring.Humidity} %</h1>
        <h1>History</h1>
          <button style={{backgroundColor: `${lampu1 ? "#00ff4d" : "#ff0000" }`, width: "120px", height: "40px", border: "none", cursor: "pointer"}} onClick={() => {
              controlLampu()
          }}>{lampu1 ? "Hidup" : "Mati"}</button>
          <div>
              {
                  log.slice(0, 5).map((item, i) =>(
                      <div>
                          <p>{item.Temperature} C</p>
                          <p>{item.Humidity} %</p>
                          <p>----</p>
                      </div>
                  ))
              }
          </div>
          <p>{lampu1}</p>
          <div>
              <Line
                  data={temperatures}
                  options={{
                      plugins: {
                          title: {
                              display: true,
                              text: "Data Humidity & Temperature",
                          },
                          legend: {
                              display: true,
                              position: "bottom",
                          },
                      },
                  }}
              />
          </div>
      </div>
  );
}

export default App;