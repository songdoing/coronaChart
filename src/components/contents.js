import React, { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import axios from "axios";

const Contents = () => {
  const [confirmedData, setConfirmedData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        backgroundColor: "",
        fill: true,
        data: [],
      },
    ],
  });
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
        console.log(year, month, date);
        const confirmed = cur.Confirmed;
        const active = cur.Active;
        const death = cur.Deaths;
        const recovered = cur.Recovered;

        const findItem = acc.find(
          (a) => a.year === year && a.month === month && a.date === date
        );

        if (!findItem) {
          //key value가 같으면 생략 가능
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

      const labels = arr.map((a) => `${a.month + 1}`);
      setConfirmedData({
        labels,
        dataset: [
          {
            label: "cumulative cases",
            backgroundColor: "salmon",
            fill: true,
            data: arr.map((a) => a.confirmed),
          },
        ],
      });
    };

    fetchEvents();
  });

  return (
    <section>
      <h2>CANADA</h2>
      <div className="contents">
        <div>
          <Bar
            data={confirmedData}
            options={
              ({
                title: {
                  display: true,
                  text: "cumulative cases",
                  fontSize: 16,
                },
              },
              { legend: { display: true, position: "bottom" } })
            }
          />
        </div>
      </div>
    </section>
  );
};

export default Contents;
