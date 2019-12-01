import React, { Component, createRef } from "react";

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.googleMapRef = createRef();
  }

  componentDidMount() {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&libraries=places`;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", () => {
      this.googleMap = this.createGoogleMap();
      this.marker = this.createMarker();
    });
  }
  createGoogleMap = () =>
    new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 10,
      scrollwheel: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      center: {
        lat: this.props.lat,
        lng: this.props.lng
      }
      //disableDefaultUI: true
    });
  createMarker = () =>
    new window.google.maps.Marker({
      position: { lat: this.props.lat, lng: this.props.lng },
      map: this.googleMap
    });
  render() {
    return (
      <div
        id="google-map"
        ref={this.googleMapRef}
        style={{ width: "100%", height: "300px" }}
      />
    );
  }
}

export default GoogleMap;
