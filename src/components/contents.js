import React, { useState, useEffect } from "react";
import { Bar, Doughnut, Line, HorizontalBar } from "react-chartjs-2";
import axios from "axios";

const Contents = () => {
  const [confirmedData, setConfirmedData] = useState({});
  const [quarantinedData, setQuarantinedData] = useState({});
  const [recoveredData, setRecoveredData] = useState({});
  const [nowData, setNowData] = useState({});

  useEffect(() => {
    //데이터를 다 받은 다음에 순차적으로 실행하도록 async와 await
    const fetchEvents = async () => {
      const res = await axios.get(
        "https://api.covid19api.com/total/dayone/country/ca"
      );
      console.log(res);
      makeData(res.data);
    };
    const makeData = (items) => {
      const arr = items.reduce((acc, cur) => {
        const currentDate = new Date(cur.Date);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = currentDate.getDate();
        //console.log(year, month, date);
        //console.log(cur);
        const confirmed = cur.Confirmed;
        const active = cur.Active;
        const death = cur.Deaths;
        const recovered = cur.Recovered;

        const findItem = acc.find((a) => a.year === year && a.month === month);

        if (!findItem) {
          //key:value가 같으면 생략 가능 {year:year, month:month...}
          acc.push({ year, month, date, confirmed, active, death, recovered });
        }
        if (findItem && findItem.date < date) {
          // 오늘날짜보다 작으면 최신날짜로 업데이트해주기
          findItem.active = active;
          findItem.death = death;
          findItem.recovered = recovered;
          findItem.confirmed = confirmed;
          findItem.year = year;
          findItem.month = month;
          findItem.date = date;
        }
        //console.log(cur, year, month, date);
        return acc;
      }, []);
      console.log(arr);

      const labels = arr.map((a) => `${a.year} - ${a.month + 1}`);
      setConfirmedData({
        labels,
        datasets: [
          {
            label: "Cumulative cases",
            backgroundColor: "salmon",
            fill: true,
            data: arr.map((a) => a.confirmed),
          },
        ],
      });

      setQuarantinedData({
        labels,
        datasets: [
          {
            label: "Quarantined cases",
            borderColor: "blue",
            fill: false,
            data: arr.map((a) => a.active),
          },
        ],
      });

      setRecoveredData({
        labels,
        datasets: [
          {
            label: "Recovered cases",
            backgroundColor: "green",
            fill: false,
            data: arr.map((a) => a.recovered),
          },
        ],
      });

      //가장 최신월 가져오기
      const lastMonth = arr[arr.length - 1];
      setNowData({
        labels: ["Confirmed", "Recovered", "Deaths"],
        datasets: [
          {
            label: "Confirmed, Recovered, Deaths cases",
            backgroundColor: ["#ff3d67", "#059bff", "#ffc233"],
            borderColor: ["#ff3d67", "#059bff", "#ffc233"],
            fill: false,
            data: [lastMonth.confirmed, lastMonth.recovered, lastMonth.death],
          },
        ],
      });
    };

    fetchEvents();
  }, []);

  return (
    <section>
      <h2>CANADA</h2>
      <div className="contents">
        <div>
          <Bar
            data={confirmedData}
            options={{
              title: {
                display: true,
                text: "Cumulative cases",
                position: "top",
                fontSize: 18,
              },
              legend: { display: true, position: "bottom" },
            }}
          />
        </div>

        <div>
          <Line
            data={quarantinedData}
            options={{
              title: {
                display: true,
                text: "Quarantined cases",
                position: "top",
                fontSize: 18,
              },
              legend: { display: true, position: "bottom" },
            }}
          />
        </div>

        <div>
          <HorizontalBar
            data={recoveredData}
            options={{
              title: {
                display: true,
                text: "Recovered cases",
                position: "top",
                fontSize: 18,
              },
              legend: { display: true, position: "bottom" },
            }}
          />
        </div>

        <div>
          <Doughnut
            data={nowData}
            options={{
              title: {
                display: true,
                text: `Confirmed, Recovered, Deaths cases (${new Date().getFullYear()} - ${
                  new Date().getMonth() + 1
                })`,
                position: "top",
                fontSize: 18,
              },
              legend: { display: true, position: "bottom" },
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Contents;
