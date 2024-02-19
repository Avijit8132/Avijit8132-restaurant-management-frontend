import React, { useEffect, useState } from "react";

import { Badge, Col, Container, Pagination, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import HorizontalBarChart from "./charts/HorizontalBarChart";
import moment from "moment";

import inventoryApi from "../api/inventoryApi";
import { ShimmerTable } from "react-shimmer-effects";
import {
  DatatableWrapper,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import LeadVerticalBarChat from "./charts/DoughnutChat";

const Home = (arrayOfTask) => {
 
};

export default Home;
