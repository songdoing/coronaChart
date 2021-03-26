import React, { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import axios from "axios";

const Contents = () => {
  const [confirmedData, setConfirmedData] = useState({
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "cumulative cases",
        backgroundColor: "salmon",
        fill: true,
        data: [10, 4, 6],
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
