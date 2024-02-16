import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import inventoryApi from "../../api/inventoryApi";

const PieChart = (props) => {
  const [chartData, setChartData] = useState();
  const [statusLabels, setStatusLabels] = useState([]);

  useEffect(() => {
    async function init() {
      const fetchData = await inventoryApi.fetchReportByDate(
        "area_wise_property_report",props.customFromDate,props.customToDate
      );
      let dataForChart = [];
      let statusLables = [];
      if (fetchData && fetchData.length) {
        fetchData.map((item) => {
          if (item.city !== null) statusLables.push(item.city);
          dataForChart.push(item.count);
        });
      }
      setChartData(dataForChart);
      setStatusLabels(statusLables);
    }
    init();
  }, [props.customFromDate,props.customToDate]);
  const data = {
    labels: statusLabels,
    datasets: [
      {
        label: "city",
        data: chartData,
        backgroundColor: [
          "rgba(25,25,112,0.8)",
          "rgba(98, 186, 92,0.8)",
          "rgba(76, 140, 163,0.8)",
          "rgba(81, 10, 201, 0.8)",
          // "rgb (251, 96, 98)",
          // "rgba (85, 14, 139, 1)",
          "rgba(250, 95, 85, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        hoverOffset: 1,
      },
    ],
  };

  const options = {
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
      title: {
        display: false,
        text: "Inventory Area Wise",
      },
    },
  };

  return data.datasets.length > 0 && data.labels.length > 0 ? <Pie options={options} data={data} {...props} /> : <center  ><b>No Records</b></center> ;
};

export default PieChart;