import { useState } from "react"


export default function StormTimer({timerPressed}) {

    const [gameInProgress, setGameInProgress] = useState(false)

    return (
        <div>
            <button className="btn btn-primary" onClick={timerPressed}>Start!</button>
        </div>
    )
}