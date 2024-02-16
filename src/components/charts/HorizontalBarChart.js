import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import inventoryApi from "../../api/inventoryApi";

const HorizontalBarChart = (props) => {
  const [chartData, setChartData] = useState();
  const [stausLables, setStatusLabels] = useState([]);
  const [chartDataset, setChartDataset] = useState([]);
  const [userLead, setUserLead] = useState({});

  useEffect(() => {
    async function init() {
      const fetchData = await inventoryApi.fetchReportByDate(
        "lead_report_by_user_wise",
        props.customFromDate,
        props.customToDate
      );
      //.log("fetchData=>", fetchData);
      let dataForChart = [];
      let statusLables = [];
      if (fetchData && fetchData.length) {
        fetchData.map((item) => {
          if (item.username !== null) statusLables.push(item.username);
          dataForChart.push(item.count);
        });
      }
      setChartData(dataForChart);
      setStatusLabels(statusLables);

      // const users = await inventoryApi.fetchUsers();
      // const leadResult = await inventoryApi.fetchLeads();
      // let userLeads = {};
      // if (users && users.length) {
      //   users.map((each) => {
      //     userLeads[each.username] = String(
      //       leadResult.filter((data) => {
      //         return each.username === data.ownername;
      //       }).length
      //     );
      //   });
      // }

      // setUserLead(userLeads);

      // const barColors = [
      //   "#A9D1D7",
      //   "#A1DAD7",
      //   "#8BD0D0",
      //   "#6BAAAE",
      //   "#B4D3C4",
      //   "#ADC3B4",
      //   "#8C9FA0",
      //   "#00C0A3",
      //   "#30949D",
      // ];
      // setChartDataset([
      //   {
      //     axis: "y",
      //     label: "Lead count by user",
      //     data: Object.keys(userLeads).map((data) => userLeads[data]),
      //     fill: false,
      //     backgroundColor: barColors,
      //   },
      // ]);
    }
    init();
  }, [props.customFromDate, props.customToDate]);

  const data = {
    labels: stausLables,
    datasets: [
      {
        label: "Lead count by user",
        data: chartData,
        backgroundColor: [
          "rgba(25,25,112,0.8)",
          "rgba(98, 186, 92,0.8)",
          "rgba(76, 140, 163,0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        hoverOffset: 1,
      },
    ],
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  // const options = {
  //   indexAxis: "y",
  // };
  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: true,
        color: "white",
     },
      legend: {
        position: "top",
      },
    },
  };

  const labels = ["User Leads"];

  // const data = {
  //   labels: Object.keys(userLead),
  //   datasets: chartDataset,
  // };
  //.log('data',data);
  return data.datasets.length > 0 && data.labels.length > 0 ? <Bar options={options} data={data} width={100} height={50} /> : <center  ><b>No Records</b></center> ;
};

export default HorizontalBarChart;
