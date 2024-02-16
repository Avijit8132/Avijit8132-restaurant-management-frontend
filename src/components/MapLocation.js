import React, { useState, useEffect } from "react";

function MapLocation({sitevisit}) {
  useEffect(() => {
    if (!window.myMap) {
      window.myMap = myMap;
      const googleMapScript = document.createElement("script");
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDkVza2FtLItgn_kzJ27_A4l2Eyf3ZrOOI&callback=myMap`;
      googleMapScript.async = true;
      window.document.body.appendChild(googleMapScript);
      ////.log('refresh:');
    } else {
        myMap();
    }
  }, []);

  const myMap = () => {
    var myLatlng = new window.google.maps.LatLng(sitevisit.checkinlattitude,  sitevisit.checkinlongitude);
    var myLatlng1 = new window.google.maps.LatLng(sitevisit.checkoutlattitude,  sitevisit.checkoutlongitude);
    var mapProp = {
            center: new window.google.maps.LatLng(51.508742, -0.12085),
            zoom: 14,
          };
    var map = new window.google.maps.Map(
              document.getElementById("googleMap"),
              mapProp
            );
    
    map.setCenter(myLatlng);
    const infowindow = new window.google.maps.InfoWindow({
        content: "Check In",
        ariaLabel: "Uluru",
      });
      const infowindow1 = new window.google.maps.InfoWindow({
          content: "Check Out",
          ariaLabel: "Uluru",
        });
    var marker = new window.google.maps.Marker({
        map: map,
        position: myLatlng,
      });
    marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map,
        });
      });
      var marker1 = new window.google.maps.Marker({
        map: map,
        position: myLatlng1,
    });

    marker1.addListener("click", () => {
    infowindow1.open({
        anchor: marker1,
        map,
    });
    });
   
  };

  return (
    <div id="googleMap" style={{ width: "100%", height: "300px" }}></div>
  )
  
}

export default MapLocation;
