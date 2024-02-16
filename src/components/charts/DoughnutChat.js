import React, {useEffect,useState} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import inventoryApi from "../../api/inventoryApi";
import ChartDataLabels from 'chartjs-plugin-datalabels';
const DoughnutChat = (props) => {
  const [chartData, setChartData] = useState();
  const [stausLables, setStatusLabels] = useState([]);
  const [color, setColor] = useState([]);

  useEffect(() => {
    async function init() {
      //.log('propsfetchData',props);
      const fetchData = await inventoryApi.fetchReportByDate("lead_report_by_vertical_wise",props.customFromDate,props.customToDate);
      //.log('fetchData',fetchData);
      let dataForChart = [];
      let statusLables = [];
      let backColor = [];
      if (fetchData && fetchData.length) {
        fetchData.map((item) => {
          if(item.vertical !== null) 
          statusLables.push(item.vertical);
          dataForChart.push(item.count);
          if(item.vertical === 'Office')
            backColor.push("#ff0000");
          else if(item.vertical === 'Land')
            backColor.push("#c80815",);
          else if(item.vertical === 'Retail')
            backColor.push("#ff80ed");
          else if(item.vertical === 'Investment')
            backColor.push("#e3c6ff");
          else if(item.vertical === 'Logistic')
            backColor.push("#00d5ff");
          else if(item.vertical === 'Warehouse')
            backColor.push("#d0ae8b");
          else if(item.vertical === 'Others')
            backColor.push("#ff0000");
          else
            backColor.push("#FA5F55");

        });
    }
    setChartData(dataForChart);
    setStatusLabels(statusLables);
    setColor(backColor)
  }
    init()
  },[props.customFromDate,props.customToDate])

      const data = {
        
        labels: stausLables,
        datasets: [{
          label: "Vertical",
          data: chartData,
          backgroundColor: color,
          hoverOffset: 1
        }]
      };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
   ChartDataLabels
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


  return data.datasets.length > 0 && data.labels.length > 0 ? <Doughnut options={options} data={data} {...props} width={100} height={50} /> : <center  ><b>No Records</b></center> ;
};

export default DoughnutChat;
