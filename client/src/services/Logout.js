import React, { Component } from "react";

class Logout extends Component {
  removeToken = () => localStorage.clear();
    //localStorage.removeItem("token");
    
  
  componentDidMount() {
    this.removeToken();
    window.location = "/login";
  }
  render() {
    return <button onClick={this.removeToken}>remove</button>;
  }
}

export default Logout;
