import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";

export default function CustomSeparator(props) {
  const navigate = useNavigate();

  function handleClick(event, url) {
    event.preventDefault();
    ////.info('You clicked a breadcrumb.', event.target.href);
    navigate(url);
    //   Navigate(event.target.href === 'http://localhost:3001/' ? '/' : event.target.href );
  }

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      onClick={(e) => handleClick(e, "/")}
    >
      Home
    </Link>,
  ];
  ////.log('breadcrumbs => ', breadcrumbs)

  for (let index = 2; index <= parseInt(props?.indexLength); index++) {
    breadcrumbs.push(
      <Link
        underline="hover"
        key="2"
        color="inherit"
        href={props?.url}
        onClick={(e) => handleClick(e, props?.url)}
      >
        {props?.cmpListName}
      </Link>
    );
  }

  for (let index = 3; index <= parseInt(props?.indexViewLength); index++) {
    breadcrumbs.push(
      <Link
        underline="hover"
        key="3"
        color="inherit"
        href={props?.cmpViewUrl}
        onClick={(e) => handleClick(e, props?.cmpViewUrl)}
      >
        {props?.cmpViewName}
      </Link>
    );
  }

  breadcrumbs.push(
    <Typography key={breadcrumbs.length} color="text.primary">
      {props?.currentCmpName}
    </Typography>
  );

  ////.log('final breadcrumbs  => ', breadcrumbs)

  return (
    <Stack spacing={2}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}
