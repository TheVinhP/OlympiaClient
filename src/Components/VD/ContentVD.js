import React, { Component } from "react";
import logo from "../../logo.svg";
import io from "socket.io-client";
import "../../App.css";
import $ from "jquery";
import port from "../../port.json";
import "./VD.css";
import { BrowserRouter, Route, Link } from "react-router-dom";
const socket = io.connect(port.port); //change when change wifi
let check = true;
class ContentVD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gmail: "",
      password: "",
      data: [],
      question: "",
      score: 0,
      current: 0,
    };
  }
  componentDidMount() {
    this.setState({
      data: this.props.data,
      current: this.props.current[0] ? this.props.current[0].current : 0,
    });
    // this.setState({
    //   score: this.state.data[this.state.current]
    //     ? this.state.data[this.state.current].score
    //     : "gasg",
    // });

    socket.on("choose ques", (ques) => {
      this.setState({
        question: ques,
      });
    });

    socket.on("add point ok", (data) => {
      this.setState({
        score: data.point,
        current: data.stt,
      });
      if (data.data != null) this.setState({ data: data.data });
    });

    socket.on("change pp", (qwef) => {
      if (check == true) {
        $("#progressBar").css("background-color", "#cfd6d9");
        $(".bar").css("background-color", "#428bca");
        progress(60, 60, $("#progressBar"));
        check = false;
      }
    });
  }
  //qweg
  render() {
    $(".names").removeClass("CrName");
    $(".names").eq(this.state.current).addClass("CrName");
    return (
      <div className="App row">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <table id="NameList">
            <tbody>
              <tr>
                {this.state.data.map((user, id) => {
                  return (
                    <td className="names" key={id}>
                      {user.name} ({user.score})
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
          {/* <p>
            {this.state.data[this.state.current]
              ? this.state.data[this.state.current].name
              : "ngu"}
          </p> */}
          <div className="questions col-11">
            <div>
              <p className="question quess">{this.state.question} </p>
            </div>
            <div className="score col-4">{this.state.score}</div>
          </div>

          <div id="progressBar">
            <div className="bar"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default ContentVD;
function progress(timeleft, timetotal, $element) {
  var progressBarWidth = (timeleft * $element.width()) / timetotal;
  $element
    .find("div")
    .animate({ width: progressBarWidth }, 500)
    .html(Math.floor(timeleft / 60) + ":" + (timeleft % 60));
  if (timeleft > 0) {
    setTimeout(function () {
      progress(timeleft - 1, timetotal, $element);

      //$(".bar").css("background-color", "red");
    }, 1000);
  } else {
    $("#progressBar").css("background-color", "red");
    $(".bar").css("background-color", "red");
    check = true;
  }
}
