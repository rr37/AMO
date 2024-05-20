import React, { useEffect } from 'react'
import ReactDOMServer from 'react-dom/server'
import './ScheduleSVG.css'
import scheduledata from './schedule.json'

const ScheduleSVG = () => {
  useEffect(() => {
    // 在組件加載完成後輸出資訊
    console.log(scheduledata.speakers)
  }, [])

  const extractTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const getSpeakerName = (id) => {
    const speaker = scheduledata.speakers.find(
      (speaker) => speaker.id.toString() === id.toString()
    )
    return speaker ? speaker.zh.name : ''
  }

  const generateSVG = ({ sessions }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="600"
        height={`${40 + sessions.length * 40}`}
      >
        <style>
          {`
            text { font-family: Arial, sans-serif; }
            .time { fill: #ffffff; }
            .title { fill: #000000; }
            .speaker { fill: #000000; }
          `}
        </style>
        {sessions.map((session, index) => {
          const yPosition = 30 + index * 40
          const rectHeight = 20
          const rectRadius = 10

          return (
            <g key={session.id}>
              <rect
                x="0"
                y={yPosition - rectHeight + 5}
                width="70"
                height={rectHeight}
                rx={rectRadius}
                ry={rectRadius}
                fill="#007bff"
              />
              {/* 時間 */}
              <text x="10" y={yPosition} className="time">
                {extractTime(session.start)}
              </text>

              {/* 中文標題 */}
              <text x="80" y={yPosition} className="title">
                {session.zh.title}
              </text>

              {/* 英文標題 */}
              <text x="80" y={yPosition+20} className="title">
                {session.en.title}
              </text>

              {/* 講者 */}
              {session.speakers && (
                <text x="300" y={yPosition} className="speaker">
                  {getSpeakerName(session.speakers)}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    )
  }

  const downloadSVG = () => {
    // 把 React 的元素轉換為正常的 html 字串
    const svgContent = ReactDOMServer.renderToStaticMarkup(generateSVG({ sessions: scheduledata.sessions }))
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'schedule.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <div className="svg-container">
        {generateSVG({ sessions: scheduledata.sessions })}
      </div>
      <button className="download-button" onClick={downloadSVG}>
        Download as SVG
      </button>
    </div>
  )
}

export default ScheduleSVG
