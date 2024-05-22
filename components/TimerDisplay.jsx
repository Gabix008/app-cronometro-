import React from "react";
import './Timer.css'
const TimerDisplay = ({time}) =>{
    return(
        <div className="timer-display">{time}</div>
    )
}
export default TimerDisplay;