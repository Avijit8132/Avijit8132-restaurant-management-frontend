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
import { propTypes } from "react-bootstrap/esm/Image";
// import { cl } from '@fullcalendar/core/internal-common';

const BarChart = (props) => {
  const [chartData, setChartData] = useState();
  const [stausLables, setStatusLabels] = useState([]);
  const [chartDataset, setChartDataset] = useState([]);

  var month = [];
  useEffect(() => {
    async function init() {
      const fetchData = await inventoryApi.fetchReportByDate(
        "status_wise_lead_report",props.customFromDate,props.customToDate
      );

      //.log("fetchData=>", fetchData);

      let dataForChart = [];
      let statusLables = [];
      if (fetchData && fetchData?.length) {
        fetchData.map((item) => {
          if(item.status !== null) statusLables.push(item.status);
          dataForChart.push(item.count);
        });
        //.log("dataForChart:", dataForChart);
        //.log("statusLables:", statusLables);
        setChartData(dataForChart);
        setStatusLabels(statusLables);
      }

      const barColors = [ "#A9D1D7",      
      "#A1DAD7",        
      "#8BD0D0",      
      "#6BAAAE",  
      "#B4D3C4",    
      "#ADC3B4",  
      "#8C9FA0",      
      "#00C0A3",      
      "#30949D"]
      
      setChartDataset(
        dataForChart.map((data, index) => {
          return {
            label: statusLables[index],
            data: data,
            backgroundColor: barColors[index],
          }
        })
      )
      
    }
    init();
  }, [props.customFromDate,props.customToDate]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

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
        text: "Stage wise leads",
      },
    },
  };


  const labels = ["Stagewise Leads"];


  // const data = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       label: ["Stage wise count"],
  //       data: chartData,
  //       backgroundColor: "#9ad0f5",
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  const data = {
    labels,
    datasets: chartDataset,
  };

  // {
  //   labels,
  //   datasets: chartData/*  [
  //     {
  //       label: "Income",
  //       // data: incomeCount,
  //       data : incomeCount,
  //       backgroundColor: "	#d184d8",
  //       // : 'rgba(255, 215, 0,0.7)' ,
  //     },
  //     {
  //       label: "Expense",
  //       // data: expenseCount,
  //       data : expenseCount,
  //       backgroundColor: "#d8d184",
  //       // backgroundColor: 'rgba(25, 135, 84, 0.7)',
  //     },
  //   ], */
  // };
  return data.datasets.length > 0 && data.labels.length > 0 ? <Bar options={options} data={data} width={100} height={50} /> : <center  ><b>No Records</b></center> ;
};

export default BarChart;
