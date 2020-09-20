import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionNumber: 0,
      questions: [{
        url: "https://www.free-shutter-stock.com/free_stock/thumbnails/th1/e7f566caff446faceeaa8864d05b167da8567404.jpeg",
        answer: "cat"
      },
      {
        url: "https://clipartix.com/wp-content/uploads/2016/08/Free-clicpart-cartoon-cars-clipart-the-cliparts.png",
        answer: "car"
      },
      {
        url: "https://i.pinimg.com/originals/ea/d3/90/ead3904ee58351c70a3959d2d814ffad.jpg",
        answer: "dog"
      },
      {
        url: "https://i.pinimg.com/originals/7a/c7/57/7ac757d03bbaf6bdb04746505a58ef7c.jpg",
        answer: "zoo"
      }
      ]
    }
  }

  onQuestionComplete() {
    if (this.state.questionNumber < this.state.questions.length - 1) {
      this.setState({ questionNumber: this.state.questionNumber + 1 })
    }
  }

  render() {
    return (<div className="game">
      <Board
        question={this.state.questions[this.state.questionNumber]}
        onQuestionComplete={this.onQuestionComplete.bind(this)}>
      </Board>
    </div>);
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionNumber: 0,
      answerArray: Array(props.question.answer.length).fill('')
    }
  }

  onCorrectInput(focusIndex, input) {
    const newAnswerArray = this.state.answerArray.slice();
    newAnswerArray[focusIndex] = input;
    this.setState({ answerArray: newAnswerArray })
    console.log(`correct input ${input}`)
  }

  onIncorrectInput(input) {
    console.log(`incorrect input ${input}`)
  }

  onCompleteInput() {
    this.setState({ answerArray: this.state.answerArray.slice().fill('') })
    this.props.onQuestionComplete()
  }



  render() {
    return (<div className="board">
      {FlashCard({ url: this.props.question.url })}
      <AnswerInput
        answer={this.props.question.answer}
        answerArray={this.state.answerArray}
        onCorrect={this.onCorrectInput.bind(this)}
        onIncorrect={this.onIncorrectInput.bind(this)}
        onComplete={this.onCompleteInput.bind(this)}></AnswerInput>
    </div>)
  }
}

class AnswerInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      focusIndex: 0
    }
    this.onInput = this.onInput.bind(this)
  }

  componentDidMount() {
    this.inputRefArray[0].current.focus()
  }

  onInput(event) {
    var focusIndex = this.state.focusIndex;
    const answerLength = this.props.answer.length;
    const maxIndex = answerLength - 1;
    const inputValue = event.target.value;

    if ((focusIndex < answerLength)
      && (inputValue === this.props.answer[focusIndex])) {
      this.props.onCorrect(focusIndex, inputValue)
      if (focusIndex < maxIndex) {
        focusIndex++
      } else {
        focusIndex = 0;
        this.props.onComplete()
      }

    } else {
      this.props.onIncorrect(inputValue)
    }

    this.setState({ focusIndex: focusIndex })
    this.inputRefArray[focusIndex].current.focus();

  }

  inputBoxes(refArray, focusIndex) {
    return refArray.map((ref, index) => (<input type="text" ref={ref} key={index.toString()} value={this.props.answerArray[index]} onInput={this.onInput} maxLength="1" size="1"></input>))
  }

  render() {
    this.inputRefArray = Array(this.props.answer.length)
    for (var x = 0; x < this.inputRefArray.length; x++) {
      this.inputRefArray[x] = React.createRef();
    }
    return (<div className="answerinput">
      {this.inputBoxes(this.inputRefArray, this.state.focusIndex)}
    </div>)
  }
}

function FlashCard(props) {
  return (<div className="flashcard"><img src={props.url} alt=""></img></div>)
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

