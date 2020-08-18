import React, { Component } from "react";
import logo from "../../logo.svg";
import io from "socket.io-client";
import "../../App.css";
import $ from "jquery";
import port from "../../port.json";
import PointQues from "./Img/PointQues.PNG";
import "./VD.css";
const socket = io.connect(port.port); //change when change wifi
let stop = false;
let thisd;
let check = true;
let time1, time2;
let dispute = false,
  isStar = false,
  choosePointQues = 0;
let id = 0;
class AdminCHP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gmail: "",
      password: "",
      data: [],
      questions: [],
      question: "",
      questionGoingOn: [],
      currentQues: 0,
      currentUser: 0,
      examUser: 0,
      score: 0,
    };
  }

  componentDidMount() {
    thisd = this;
    this.setState({
      questions: this.props.questions,
      data: this.props.data,
      //currentUser: this.props.current[0] ? this.props.current[0].current : 0,
    });

    socket.on("on send VD", (ques) => {
      if (ques && dispute == true) {
        console.log(ques.id);
        id = ques.id;
        socket.emit("send VD", ques);
        $(".names").removeClass("onAlertVD");
        $(".names").eq(ques.id).addClass("onAlertVD");
        stops();
        dispute = false;
      }
    });
  }
  //

  NextQuesVD() {
    isStar = false;
    let { currentQues } = thisd.state;
    $(".names").removeClass("onAlertVD");
    dispute = false;
    currentQues++;
    thisd.setState({
      currentQues: currentQues,
      question: thisd.state.questions[currentQues],
    });
    socket.emit("choose ques", thisd.state.questions[currentQues].ques);
  }

  CheckAnsVD(TrueOrFalse) {
    if (TrueOrFalse == true) {
      console.log(this.state.examUser);
      socket.emit("true chp", this.state.data[id].name);
    } else if (TrueOrFalse == false) {
      // dispute = false;
      $(".names").removeClass("onAlertVD");
      dispute = true;
      start();
      progress(time1, 15, $("#progressBar"));
      socket.emit("start time", time1);
    }
  }

  TimerVD(time) {
    console.log(time);
    $("#progressBar").css("background-color", "#cfd6d9");
    $(".bar").css("background-color", "#428bca");
    progress(time, time, $("#progressBar"));
    socket.emit("time VD", time);
  }

  disputeAns() {
    console.log("who answer fastest !!");
    //=========Timer 5s========
    dispute = true;
    $("#progressBar").css("background-color", "#cfd6d9");
    $(".bar").css("background-color", "#428bca");

    progress(15, 15, $("#progressBar"));
    socket.emit("time VD", 15);
  }

  //✔
  render() {
    //console.log(this.state.currentQues);
    // if (document.getElementsByClassName("ques")[this.state.currentQues]) {
    //   document.getElementsByClassName("ques")[
    //     this.state.currentQues
    //   ].innerHTML = "current";
    //}
    //  console.log(this.state.data[0] ? this.state.data[0].score : "????????");
    $(".ques").removeClass("active");
    $(".ques").eq(this.state.currentQues).addClass("active");

    return (
      <div className="App row">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <table id="NameList">
            <tbody>
              <tr>
                {this.state.data.map((user, id) => {
                  return (
                    <td className="names pointer" key={id}>
                      {user.name} ({user.score})
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>

          <div className="questions col-11">
            <div>
              <p className="question quess">
                {this.state.question ? this.state.question.ques : ""}{" "}
              </p>
            </div>
            <div className="score col-4">
              {this.state.data[this.state.examUser]
                ? this.state.data[this.state.examUser].score
                : 0}
            </div>
          </div>
          <button
            className="btn btn-info NextQuesVD timeVD abso"
            onClick={this.NextQuesVD}
          >
            ▶▶
          </button>
          <button
            className="btn btn-dark TrueAnsVD abso"
            onClick={() => this.CheckAnsVD(true)}
          >
            ✅
          </button>
          <button
            className="btn btn-dark FalseAnsVD  abso"
            onClick={() => this.CheckAnsVD(false)}
          >
            ❌
          </button>

          <button
            className="btn btn-danger fiveVD timeVD abso"
            onClick={this.disputeAns}
          >
            🕒15s
          </button>

          {/* <img src={PointQues}></img> */}
          <div id="progressBar" className="progressBarVD ">
            <div className="bar barVD"></div>
          </div>
        </div>
      </div>
    );
  }
  AddScore = (name, scoreAdd, id) => {
    let data = this.state.data;
    if (data[id]) {
      data[id].score += scoreAdd;
      console.log(data);
      this.setState({ data: data });
      socket.emit("Add score", {
        name: name,
        score: data[id].score,
        data: data,
      });
    }
  };
}

export default AdminCHP;
function progress(timeleft, timetotal, $element) {
  if (stop == false) {
    time1 = timeleft;
    time2 = timetotal;
    var progressBarWidth = (timeleft * $element.width()) / timetotal;
    $element
      .find("div")
      .animate({ width: progressBarWidth }, 500)
      .html(timeleft % 60);
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
}
function stops() {
  stop = true;
}
function start() {
  stop = false;
}
//progress(15, 15, $("#progressBar"));
//The Anh :4203
//Ngguyen Huu Truong :5226
//Vinh : 4177
//ducga321@
