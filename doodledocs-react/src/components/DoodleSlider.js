import React, {Component} from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import '../css/Slider.css'


class DoodleSlider extends Component{
  constructor(){
    super()
    this.state={
      sliding: false,
      value: 0
    }
    this.handleChange=this.handleChange.bind(this)
  }

  handleChange(value){
    this.setState({
      value
    })
    this.props.handleSlide(value)
  }


  render(){
    return(
      <Slider
      className="slider"
      min={0}
      max={this.props.max}
      defaultValue={0}
      value={this.state.value}
      onChange={this.handleChange}
       />
    )
  }

}

export default DoodleSlider
