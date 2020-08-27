import React, { Component } from "react";
import io from "socket.io-client";
import "../../App.css";
import port from "../../port.json";
import $ from "jquery";
import "./VD.css";
const socket = io.connect(port.port); //change when change wifi
let check = true;
class UserCHP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gmail: "",
      password: "",
      data: [],
      questions: [],
      question: "",
      currentQues: 0,
      currentUser: 0,
      answerVCNV: "",
    };
  }
  componentDidMount() {
    socket.on("choose ques", (ques) => {
      console.log(ques);
      this.setState({
        question: ques,
      });
      check = true;
    });

    this.setState({
      questions: this.props.questions,
      data: this.props.data,
      current: this.props.current[0] ? this.props.current[0].current : 0,
    });
    // this.setState({
    //   score: this.state.data[this.state.current]
    //     ? this.state.data[this.state.current].score
    //     : "gasg",
    // });

    // socket.on("choose ques", (ques) => {
    //   localStorage.setItem("submitVCNV", 1);
    //   this.setState({
    //     question: ques.ques,
    //   });
    //   localStorage.setItem("submitVCNV", 1);
    // });

    // socket.on("add point ok", (data) => {
    //   this.setState({
    //     score: data.point,
    //     current: data.stt - 1,
    //   });
    //   if (data.data != null) this.setState({ data: data.data });
    // });
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

  //===========================================================
  onSubmitAnswerVD = () => {
    let id = localStorage.tooken ? localStorage.tooken : 0;
    let name = this.state.data[id] ? this.state.data[id].name : "NO NAME";
    socket.emit("on send VD", {
      id: id,
      name: name,
    });
  };

  render() {
    //$(".names").removeClass("CrName");
    // $(".names").eq(this.state.current).addClass("CrName");
    return (
      <div className="App">
        <div className="App-header">
          <div className="questionsVCNV col-11">
            <div>
              <p className="questionVCNV quessVCNV">{this.state.question} </p>
            </div>
            {/* <div className="score col-4">{this.state.score}</div> */}
          </div>
          <p className="disableVCNV">{this.state.notifition}</p>
          <div className="col-11">
            <div class="form-group">
              <button
                type="button"
                name=""
                id=""
                class="btn btn-danger btn-lg btn-block submitVCNV"
                onClick={this.onSubmitAnswerVD}
              >
                QUYỀN TRẢ LỜI CÂU HỎI
              </button>

              {/* <div id="showAnswerVCNV">
                CÂU TRẢ LỜI ĐÃ GỬI : {this.state.answerVCNV.toUpperCase()}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserCHP;

function progress(timeleft, timetotal, $element) {
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
