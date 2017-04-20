import '../css/Doodle.css'
import React, {Component} from 'react'
import { setCurrentImage, addImage, setAutoSave } from '../actions/image'
import ConnectedToolBox from './ToolBox'
import { connect } from 'react-redux'
import axios from 'axios'

class Doodle extends Component {
	constructor() {
		super()
		this.state = {
			height: 1000,
			width: window.innerWidth
		}
		this.canvas = null
		this.context = null
		this.isPainting = false
		this.history = []
    this.redoHistory = []
    this.image = new Image()
    this.image.src = "http://cdn.bulbagarden.net/upload/thumb/0/0d/025Pikachu.png/250px-025Pikachu.png"
    this.radius = 1

    this.autoSave = null
    this.handleAutoSave = this.handleAutoSave.bind(this)
		this.handleSave = this.handleSave.bind(this)
		this.updateCanvas = this.updateCanvas.bind(this)
	}

  	componentDidMount() {
      this.autoSave = setInterval(() => {
        if (this.props.images.autoSave)
          this.save('PATCH', `http://localhost:3001/v1/accounts/${this.props.account.id}/images/${this.props.images.current.id}`, this.props.images.current.title)
      }, 3000)

			this.updateCanvas()

    	this.canvas.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
          this.redoHistory = []
      		this.context.strokeStyle = this.props.doodle.color
          this.context.fillStyle = this.props.doodle.color
          this.context.lineWidth = this.props.doodle.lineWidth
      		let mousePos = this.getMousePos(this.canvas, event)
          switch (this.props.doodle.tool) {
            case "free":
              this.context.beginPath() //begins path
              this.context.moveTo(mousePos.x, mousePos.y)
              this.history.push({[this.props.doodle.tool]: {start: {x: mousePos.x, y: mousePos.y, color: this.props.doodle.color, lineWidth: this.context.lineWidth}, lines: new Array()}})
              break
            case "line":
              break
            case "rectangle":
              this.context.beginPath()
              this.history.push({[this.props.doodle.tool]: {x1: mousePos.x, y1: mousePos.y, x2: 0, y2: 0, color: this.props.doodle.color, lineWidth: this.context.lineWidth}})
              break
            case "circle":
              this.context.beginPath();
              this.history.push({[this.props.doodle.tool]: {startX: mousePos.x, startY: mousePos.y, color: this.props.doodle.color, lineWidth: this.context.lineWidth, midX: null, midY: null, r: null}})
              break
            case "image":
              this.image.src = this.props.doodle.imageSrc
              if (this.image.src) {
                this.context.drawImage(this.image, mousePos.x - this.image.width / 2, mousePos.y - this.image.height / 2)
                this.history.push({[this.props.doodle.tool]: {x: mousePos.x - this.image.width / 2, y: mousePos.y - this.image.height / 2, src: this.image.src}})
              }
              break
            default:
              break
          }
          this.isPainting = true
        }
    	}, false)

    	this.canvas.addEventListener('mousemove', (event) => {
      		if (this.isPainting) {
 	    		  let mousePos = this.getMousePos(this.canvas, event)
            switch (this.props.doodle.tool) {
              case "free":
                  this.context.lineTo(mousePos.x, mousePos.y)
                  this.context.stroke() //path gets a stroke

                  this.history[this.history.length-1].free.lines.push({x: mousePos.x, y: mousePos.y})
                break
              case "line":
                break
              case "rectangle":
                  this.context.rect(this.history[this.history.length-1].rectangle.x1, this.history[this.history.length-1].rectangle.y1, mousePos.x - this.history[this.history.length-1].rectangle.x1, mousePos.y - this.history[this.history.length-1].rectangle.y1)
                  this.context.fill()

                  this.history[this.history.length-1].rectangle.x2 = mousePos.x - this.history[this.history.length-1].rectangle.x1
                  this.history[this.history.length-1].rectangle.y2 = mousePos.y - this.history[this.history.length-1].rectangle.y1
                break
              case "circle":
                  let circleInfo = this.history[this.history.length-1].circle
                  let dx = Math.abs(circleInfo.startX - mousePos.x);
                  let dy = Math.abs(circleInfo.startY - mousePos.y);
                  let midX = (circleInfo.startX + mousePos.x) / 2;
                  let midY = (circleInfo.startY + mousePos.y) / 2;
                  let r = Math.sqrt(dx * dx + dy * dy) / 2;
                  this.context.arc(midX, midY, r, 0, 2 * Math.PI);
                  this.context.fillStyle = circleInfo.color
                  this.context.lineWidth = circleInfo.lineWidth
                  this.context.fill();

                  this.history[this.history.length-1].circle.midX = midX
                  this.history[this.history.length-1].circle.midY = midY
                  this.history[this.history.length-1].circle.r = r
                break
              default:
                break
            }
      		}
    	})

    	this.canvas.addEventListener('mouseup', (event) => {
      		this.isPainting = false
      		console.log(this.history)
      		// console.log(this.history.reduce((sum, val) => { return val.free.lines.length + sum},0))
    	}, false)

    	// undo feature
    	document.addEventListener('keydown', (event) => {
      		if (event.keyCode === 90 && event.ctrlKey &&
      		    !this.isPainting && this.history.length > 0) {
            this.redoHistory.push(this.history[this.history.length-1])
            console.log(this.redoHistory.length)
      			this.history = this.history.slice(0, -1)
				    this.drawImage(this.context, this.history)
      		} else if (event.keyCode === 82 && event.ctrlKey &&
              !this.isPainting && this.redoHistory.length > 0) {
            console.log('redoing')
            this.history.push(this.redoHistory[this.redoHistory.length-1])
            this.redoHistory = this.redoHistory.slice(0, -1)
            this.drawImage(this.context, this.history)
          }
    	})
  	}

    componentWillUnmount() {
      clearInterval(this.autoSave)
      this.props.setAutoSave(false)
    }

  	componentDidUpdate(prevProps, prevState) {
			this.updateCanvas()
  	}

    componentWillMount() {
      // if currentImage is something, restore it
      if (this.props.images.current)
        this.restoreImage()
    }

		updateCanvas() {
			this.canvas = document.getElementById('app-canvas');
    	this.context = this.canvas.getContext('2d')
			if (!this.props.images.current) {
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
				this.history = []
				this.redoHistory = []
				this.props.setCurrentImage('new')
			}
		}

    restoreImage() {
      axios({
        method: 'GET',
        url: `http://localhost:3001/v1/accounts/${this.props.account.id}/images/${this.props.images.current.id}`,
      })
      .then(resp => {
        let imageData = resp.data.image_data
        this.history = imageData
        this.drawImage(this.context, this.history)
      })
    }

    handleSave(event) {
      event.preventDefault()
      let url = `http://localhost:3001/v1/accounts/${this.props.account.id}/images`
      let title = 'Test Image'
      if (event.target[0] && event.target[0].name === "title")
        title = event.target[0].value
      let method = 'POST'
      if (this.props.images.current) {
        url = url + `/${this.props.images.current.id}`
        method = 'PATCH'
        title = this.props.images.current.title
      }
      this.save(method, url, title)
    }

    save(method, url, title) {
      let lowQualityImage = this.canvas.toDataURL('image/png', 0.01)
      axios({
        method: method,
        url: url,
        data: JSON.stringify({image: this.history, preview: lowQualityImage, title: title})
      })
      .then(resp => {
          console.log("Saved...")
          if (this.props.images.current.id !== resp.data.id) {
            this.props.setCurrentImage(resp.data.id)
            this.props.addImage({id: resp.data.id, title: title, data_url: lowQualityImage})
          }
      })
    }

    handleAutoSave(event) {
      this.props.setAutoSave(event.target.checked)
    }

    drawImage(context, history) {
      context.clearRect(0, 0, 1500, 1500)
      for (let i = 0; i < history.length; i++) {
        switch (Object.keys(history[i])[0]) {
          case "free":
            this.drawFree(context, history[i])
            break
          case "rectangle":
            this.drawRect(context, history[i].rectangle)
            break
          case "circle":
            this.drawCircle(context, history[i].circle)
            break
          case "line":
            break
          case "image":
            let image = new Image()
            image.src = this.history[i].image.src
            this.context.drawImage(image, history[i].image.x, history[i].image.y)
          default:
            break
        }
      }
    }

    drawFree(context, picture, undo) {
        context.beginPath()
        context.moveTo(picture.free.start.x, picture.free.start.y)
        context.strokeStyle = picture.free.start.color
        context.lineWidth = picture.free.start.lineWidth
        for (let j = 0; j < picture.free.lines.length; j++) {
            context.lineTo(picture.free.lines[j].x, picture.free.lines[j].y)
            context.stroke()
        }
    }

    drawRect(context, rect) {
      this.context.beginPath()
      this.context.fillStyle = rect.color
      this.context.rect(rect.x1, rect.y1, rect.x2, rect.y2)
      this.context.fill()
    }

    drawCircle(context, circle) {
      this.context.beginPath()
      this.context.arc(circle.midX, circle.midY, circle.r, 0, 2 * Math.PI)
      this.context.fillStyle = circle.color
      this.context.lineWidth = circle.lineWidth
      this.context.fill();
    }

    drawLine(context, line) {

    }

    drawAnimatedLine(line1, line2) {
      let animation = setInterval(() => {

      }, 10)
    }

  	writeMessage(canvas, message) {
    	let context = this.canvas.getContext('2d');
    	context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    	context.font = '18pt Calibri';
    	context.fillStyle = 'black';
    	context.fillText(message, 10, 25);
  	}

  	getMousePos(canvas, evt) {
    	let rect = this.canvas.getBoundingClientRect()
    	return {
      		x: evt.clientX - rect.left,
      		y: evt.clientY - rect.top
    	};
  	}

	render() {
		let saving = null
		if (this.props.account.token && typeof this.props.images.current.id !== 'number') {
			saving =
				<form onSubmit={this.handleSave}>
					<label>Title: </label><input type="text" name="title" placeholder="title"/>
					<input type="submit" value="Save" />
				</form>
		} else if (this.props.account.token && typeof this.props.images.current.id === 'number') {
			saving = <div> <input onClick={this.handleSave} type="submit" value="Save" /> <label>AutoSave</label> <input type="checkbox" name="autosave" onClick={this.handleAutoSave} /> </div>
		}
		return (
			<div className="doodle">
            <ConnectedToolBox />
      			{saving}
      			<canvas tabIndex='1' id="app-canvas" width={this.state.width} height={this.state.height} />
      		</div>
		)
	}
}

const mapStateToProps = (state) => ({
	doodle: state.doodle,
	account: state.account,
  images: state.images
})

const mapDispatchToProps = (dispatch) => ({
  setCurrentImage: (image) => {
    dispatch(setCurrentImage(image))
  },
	addImage: (image) => {
		dispatch(addImage(image))
	},
  setAutoSave: (bool) => {
    dispatch(setAutoSave(bool))
  }
})

const ConnectedDoodle = connect(mapStateToProps, mapDispatchToProps)(Doodle);

export default ConnectedDoodle
