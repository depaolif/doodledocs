import '../css/Doodle.css'
import React, {Component} from 'react'
import { setCurrentImage, addImage, setAutoSave, resetImage, updatePreviewForImage } from '../actions/image'
import { setSliderValue } from '../actions/slider'
import { setTool } from '../actions/doodle'
import ConnectedToolBox from './ToolBox'
import { connect } from 'react-redux'
import axios from 'axios'
import DoodleSlider from './DoodleSlider'

class Doodle extends Component {
	constructor() {
		super()

		this.redoHistory = []

		this.state = {
			height: 1000,
			width: window.innerWidth,
			history: [],
			redoHistory: [],
			imageTitle: '',
			isPainting: false
		}

		this.canvas = null
		this.context = null
		this.autoSave = null

		this.handleAutoSave = this.handleAutoSave.bind(this)
		this.handleSave = this.handleSave.bind(this)
		this.updateCanvas = this.updateCanvas.bind(this)
		this.renderHistory = this.renderHistory.bind(this)
		this.mouseDownEventListener = this.mouseDownEventListener.bind(this)
		this.mouseUpEventListener = this.mouseUpEventListener.bind(this)
		this.mouseMoveEventListener = this.mouseMoveEventListener.bind(this)
		this.keyDownEventListener = this.keyDownEventListener.bind(this)
		this.keyPressEventListener = this.keyPressEventListener.bind(this)
		this.handleInputChange = this.handleInputChange.bind(this)
	}

	mouseDownEventListener(event) {
		if (event.button === 0 && this.props.slider.value === this.state.history.length) {
			this.setState({ redoHistory: [] })
			this.context.strokeStyle = this.props.doodle.color
			this.context.fillStyle = this.props.doodle.color
			this.context.lineWidth = this.props.doodle.lineWidth
			let mousePos = this.getMousePos(this.canvas, event)
			let tempNewHistory = null
			switch (this.props.doodle.tool) {
				case "free":
					this.context.beginPath() //begins path
					this.context.moveTo(mousePos.x, mousePos.y)
					tempNewHistory = this.state.history
					tempNewHistory.push({[this.props.doodle.tool]: {start: {x: mousePos.x, y: mousePos.y, color: this.props.doodle.color, lineWidth: this.context.lineWidth}, lines: []}})
					this.setState({ history: tempNewHistory})
					break
					case "line":
					this.context.beginPath()
					this.context.moveTo(mousePos.x, mousePos.y)
					tempNewHistory = this.state.history
					tempNewHistory.push({[this.props.doodle.tool]: {x1: mousePos.x, y1: mousePos.y, x2: 0, y2: 0, color: this.props.doodle.color, lineWidth: this.context.lineWidth}})
					this.setState({ history: tempNewHistory})
					break
					case "rectangle":
					this.context.beginPath()
					tempNewHistory = this.state.history
					tempNewHistory.push({[this.props.doodle.tool]: {x1: mousePos.x, y1: mousePos.y, x2: 0, y2: 0, color: this.props.doodle.color, lineWidth: this.context.lineWidth}})
					this.setState({ history: tempNewHistory})
					break
					case "circle":
					this.context.beginPath()
					tempNewHistory = this.state.history
					tempNewHistory.push({[this.props.doodle.tool]: {startX: mousePos.x, startY: mousePos.y, color: this.props.doodle.color, lineWidth: this.context.lineWidth, midX: null, midY: null, r: null}})
					this.setState({ history: tempNewHistory})
					break
					case "image":
					let image = new Image()
					image.src = this.props.doodle.imageSrc
					if (image.src) {
						this.context.drawImage(image, mousePos.x - image.width / 2, mousePos.y - image.height / 2)
						tempNewHistory = this.state.history
						tempNewHistory.push({[this.props.doodle.tool]: {x: mousePos.x - image.width / 2, y: mousePos.y - image.height / 2, src: image.src}})
						this.setState({ history: tempNewHistory})
					}
					break
					case "text":
					tempNewHistory = this.state.history
					tempNewHistory.push({[this.props.doodle.tool]: {x: mousePos.x, y: mousePos.y, text: '', font: '48px serif', color: '#000'}})
					this.setState({ history: tempNewHistory })
					break
					default:
					break
				}
				this.setState({
					isPainting: true
				})
				this.props.setSliderValue(this.state.history.length)
			}
		}

		mouseMoveEventListener(event) {
			if (this.state.isPainting && this.props.slider.value === this.state.history.length) {
				let mousePos = this.getMousePos(this.canvas, event)
				let tempNewHistory = null
				switch (this.props.doodle.tool) {
					case "free":
					this.context.lineTo(mousePos.x, mousePos.y)
						this.context.stroke() //path gets a stroke
						tempNewHistory = this.state.history
						tempNewHistory[tempNewHistory.length-1].free.lines.push({x: mousePos.x, y: mousePos.y})
						this.setState({ history: tempNewHistory })
						break
						case "rectangle":
						this.context.rect(this.state.history[this.state.history.length-1].rectangle.x1, this.state.history[this.state.history.length-1].rectangle.y1, mousePos.x - this.state.history[this.state.history.length-1].rectangle.x1, mousePos.y - this.state.history[this.state.history.length-1].rectangle.y1)
						this.context.fill()
						tempNewHistory = this.state.history
						tempNewHistory[tempNewHistory.length-1].rectangle.x2 = mousePos.x - tempNewHistory[tempNewHistory.length-1].rectangle.x1
						tempNewHistory[tempNewHistory.length-1].rectangle.y2 = mousePos.y - tempNewHistory[tempNewHistory.length-1].rectangle.y1
						this.setState({ history: tempNewHistory })
						break
						case "circle":
						let circleInfo = this.state.history[this.state.history.length-1].circle
						let dx = Math.abs(circleInfo.startX - mousePos.x)
						let dy = Math.abs(circleInfo.startY - mousePos.y)
						let midX = (circleInfo.startX + mousePos.x) / 2
						let midY = (circleInfo.startY + mousePos.y) / 2
						let r = Math.sqrt(dx * dx + dy * dy) / 2
						this.context.arc(midX, midY, r, 0, 2 * Math.PI)
						this.context.fillStyle = circleInfo.color
						this.context.lineWidth = circleInfo.lineWidth
						this.context.fill()

						tempNewHistory = this.state.history
						tempNewHistory[tempNewHistory.length-1].circle.midX = midX
						tempNewHistory[tempNewHistory.length-1].circle.midY = midY
						tempNewHistory[tempNewHistory.length-1].circle.r = r
						this.setState({ history: tempNewHistory })
						break
						default:
						break
					}
					this.setState({
						historyLength: this.state.history.length
					})
				}
			}

			mouseUpEventListener(event) {
				let mousePos = this.getMousePos(this.canvas, event)
				let tempNewHistory = null
				if (this.props.slider.value === this.state.history.length) {
					switch (this.props.doodle.tool) {
						case "line":
						this.context.lineTo(mousePos.x, mousePos.y)
						this.context.stroke()

						tempNewHistory = this.state.history
						tempNewHistory[tempNewHistory.length-1].line.x2 = mousePos.x
						tempNewHistory[tempNewHistory.length-1].line.y2 = mousePos.y
						this.setState({ history: tempNewHistory })
						this.setState({
							historyLength: this.state.history.length
						})
						this.props.setSliderValue(this.state.history.length)
						break
						case "free":
						if (this.state.history[this.state.history.length-1].free.lines.length === 0) {
							tempNewHistory = this.state.history
							tempNewHistory = tempNewHistory.slice(0, tempNewHistory.length-1)
							this.setState({ history: tempNewHistory })
							this.props.setSliderValue(this.state.history.length)
						}
						break
						default:
						break
					}
				}
				this.setState({ isPainting: false })
			}

			keyDownEventListener(event) {
				if (this.props.slider.value === this.state.history.length && this.props.doodle.tool !== 'text') {
					if (event.keyCode === 90 && event.ctrlKey &&
						!this.state.isPainting && this.state.history.length > 0) {
						let tempNewRedoHistory = this.state.redoHistory
					tempNewRedoHistory.push(this.state.history[this.state.history.length-1])
					this.setState({ redoHistory: tempNewRedoHistory })
					console.log(this.state.redoHistory.length)
					let tempNewHistory = this.state.history.slice(0, -1)
					this.setState({ history: tempNewHistory })
					this.drawImage(this.context, tempNewHistory)
				} else if (event.keyCode === 82 && event.ctrlKey &&
					!this.state.isPainting && this.state.redoHistory.length > 0) {
					console.log('redoing')
					let tempNewHistory = this.state.history
					tempNewHistory.push(this.state.redoHistory[this.state.redoHistory.length-1])
					this.setState({ history: tempNewHistory })
					let tempNewRedoHistory = this.state.redoHistory.slice(0, -1)
					this.setState({ redoHistory: tempNewRedoHistory })
					this.drawImage(this.context, tempNewHistory)
				}
				this.props.setSliderValue(this.state.history.length)
			}
		}

		keyPressEventListener() {
			if (this.props.slider.value === this.state.history.length
				&& this.props.doodle.tool === 'text' 
				&& this.state.history[this.state.history.length-1].text) {
				let tempNewHistory = this.state.history
			tempNewHistory[tempNewHistory.length - 1].text.text += event.key
			this.context.font = tempNewHistory[tempNewHistory.length - 1].text.font
			this.context.fillText(tempNewHistory[tempNewHistory.length - 1].text.text, tempNewHistory[tempNewHistory.length - 1].text.x, tempNewHistory[tempNewHistory.length - 1].text.y)
			this.setState({ history: tempNewHistory })
			console.log(this.state.history)
		}
	}

	componentWillMount() {
		// if currentImage is something, restore it
		if (this.props.match.params.imageId)
			this.restoreImage(true)
		else if (this.props.images.current && this.props.images.current !== 'new')
			this.restoreImage(false)
	}

	componentDidMount() {
		this.updateCanvas()
		this.context.lineCap = 'round'
		this.context.lineJoin = 'round'

		this.autoSave = setInterval(() => {
			if (this.props.images.autoSave && this.props.slider.value === this.state.history.length)
				this.save('PATCH', `http://localhost:3001/v1/accounts/${this.props.account.id}/images/${this.props.images.current.id}`, this.props.images.current.title)
		}, 3000)

			// event listeners for drawing events
			this.canvas.addEventListener('mousedown', this.mouseDownEventListener)
			this.canvas.addEventListener('mousemove', this.mouseMoveEventListener)
			this.canvas.addEventListener('mouseup', this.mouseUpEventListener)

    	// event listener for undo feature
    	document.addEventListener('keydown', this.keyDownEventListener)
    	document.addEventListener('keypress', this.keyPressEventListener)
    }

    componentDidUpdate(prevProps, prevState) {
    	this.updateCanvas()
    }

    componentWillUnmount() {
    	this.canvas.removeEventListener('mousedown', this.mouseDownEventListener)
    	this.canvas.removeEventListener('mousemove', this.mouseMoveEventListener)
    	this.canvas.removeEventListener('mouseup', this.mouseUpEventListener)
    	document.removeEventListener('keydown', this.keyDownEventListener)
    	clearInterval(this.autoSave)
    	this.props.setAutoSave(false)
    	this.props.setSliderValue(0)
    	this.props.setTool('free')
    	this.props.resetImage()
    }

	// gets canvas element and sets context to it
	// checks to see if there's a current image, and creates a blank, 'new' image if not
	updateCanvas() {
		this.canvas = document.getElementById('app-canvas')
		this.context = this.canvas.getContext('2d')
		if (!this.props.images.current) {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.setState({ history: [] })
			this.setState({ redohistory: [] })
			this.props.setCurrentImage('new')
		}
	}

	restoreImage(isPublic) {
		let url = `http://localhost:3001/v1/images/${this.props.match.params.imageId}`
		axios({
			method: 'GET',
			url: url
		})
		.then(resp => {
			let imageData = resp.data.image_data
			this.setState({ history: imageData })
			this.props.setSliderValue(imageData.length)
			this.drawImage(this.context, imageData)
			if (resp.data.account_id === this.props.account.id)
				this.props.setCurrentImage({id: resp.data.id, title: resp.data.title})
		})
	}

	handleSave(event) {
		event.preventDefault()
		let url = `http://localhost:3001/v1/accounts/${this.props.account.id}/images`
		let title = 'Test Image'
		if (event.target[0] && event.target[0].name === "title")
			title = event.target[0].value
		let method = 'POST'
		if (this.props.images.current !== 'new') {
			url += `/${this.props.images.current.id}`
			method = 'PATCH'
			title = this.props.images.current.Title
		}
		this.save(method, url, title)
	}

	save(method, url, title) {
		let lowQualityImage = this.canvas.toDataURL('image/png', 0.01)
		axios({
			method: method,
			url: url,
			data: JSON.stringify({image: this.state.history, preview: lowQualityImage, title: title})
		})
		.then(resp => {
			window.alert("Successfully saved!")
			if (this.props.images.current.id !== resp.data.id) {
				this.props.setCurrentImage({id: resp.data.id, title: title})
				this.props.addImage({id: resp.data.id, title: title, data_url: lowQualityImage})
			} else if (this.props.images.current.id === resp.data.id) {
				this.props.updatePreviewForImage({id: resp.data.id, preview: lowQualityImage})
			}
		})
	}

	handleAutoSave(event) {
		this.props.setAutoSave(event.target.checked)
	}

	renderHistory(value, sliding) {
		let tempHistory = this.state.history.slice(0, value)
		this.drawImage(this.context, tempHistory)
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
				this.drawLine(context, history[i].line)
				break
				case "image":
				let image = new Image()
				image.src = history[i].image.src
				this.context.drawImage(image, history[i].image.x, history[i].image.y)
				break
				case "text":
				this.context.fillStyle = history[i].text.color
				this.context.font = history[i].text.font
				this.context.fillText(history[i].text.text, history[i].text.x, history[i].text.y)
				break
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
		context.beginPath()
		context.fillStyle = rect.color
		context.rect(rect.x1, rect.y1, rect.x2, rect.y2)
		context.fill()
	}

	drawCircle(context, circle) {
		context.beginPath()
		context.arc(circle.midX, circle.midY, circle.r, 0, 2 * Math.PI)
		context.fillStyle = circle.color
		context.lineWidth = circle.lineWidth
		context.fill()
	}

	drawLine(context, line) {
		context.beginPath()
		context.moveTo(line.x1, line.y1)
		context.strokeStyle = line.color
		context.lineWidth = line.lineWidth
		context.lineTo(line.x2, line.y2)
		context.stroke()
	}

	getMousePos(canvas, evt) {
		let rect = this.canvas.getBoundingClientRect()
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		}
	}

	// handle input change for title of picture before saving
	handleInputChange(event) {
		this.setState({
			imageTitle: event.target.value
		});
	}

	render() {
		let saving = null
		if (this.props.account.token && this.props.images.current === 'new') {
			const isDisabled = this.state.imageTitle ? null : 'disabled'
			saving =
			<form onSubmit={this.handleSave}>
			<label>Title: </label><input type="text" name="title" onChange={this.handleInputChange}/>
			<input type="submit" value="Save" disabled={isDisabled} />
			</form>
		} else if (this.props.account.token && this.props.images.current && typeof this.props.images.current.id === 'number') {
			saving =
			<div>
			<h1>{this.props.images.current.title}</h1>
			<input onClick={this.handleSave} type="submit" value="Save" />
			<label>AutoSave</label>
			<input type="checkbox" name="autosave" onClick={this.handleAutoSave} />
			</div>
		}
		return (
			<div className="doodle">
				<ConnectedToolBox className="toolbox" />
				{saving}
				<DoodleSlider max={this.state.history.length} handleSlide={this.renderHistory} disabled={this.state.historyLength > 0? false : true}/>
				<canvas tabIndex='1' id="app-canvas" width={this.state.width} height={this.state.height} />
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	doodle: state.doodle,
	account: state.account,
	images: state.images,
	slider: state.slider
})

const mapDispatchToProps = (dispatch) => ({
	setCurrentImage: (image) => {
		dispatch(setCurrentImage(image))
	},
	updatePreviewForImage: (image) => {
		dispatch(updatePreviewForImage(image))
	},
	addImage: (image) => {
		dispatch(addImage(image))
	},
	setAutoSave: (bool) => {
		dispatch(setAutoSave(bool))
	},
	setTool: (tool) => {
		dispatch(setTool(tool))
	},
	setSliderValue: (value) => {
		dispatch(setSliderValue(value))
	},
	resetImage: () => {
		dispatch(resetImage())
	}
})

const ConnectedDoodle = connect(mapStateToProps, mapDispatchToProps)(Doodle)

export default ConnectedDoodle
