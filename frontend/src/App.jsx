import { useState, useRef } from "react"
import * as XLSX from "xlsx"
import axios from "axios"

function App() {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState(false)
  const [emailList, setEmailList] = useState([])
  const fileRef = useRef(null)
  const API = import.meta.env.VITE_APP_API_URL

  const handleChangeMessage = (event) => {
    setMessage(event.target.value)
  }
  const handleChangeFile = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = function (event) {
      const data = event.target.result
      const workbook = XLSX.read(data, { type: "binary" })
      const sheetname = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetname]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" })
      const totalEmail = emailList.map((item) => {
        return (item.A)
      })
      console.log(totalEmail)
      setEmailList(totalEmail)
    }
    reader.readAsBinaryString(file)
  }
  const handleSend = () => {
    if (!message.trim()) {
      alert("Please enter any text")
      return
    }

    setStatus(true)
    const emaildetails = axios.post(`${API}/sendemail`, { msg: message, emails: emailList })
    emaildetails.then((data) => {
      if (data.data === true) {
        alert("Message send successfully to email")
      } else {
        alert("Failed to send message in email")
      }
    }).catch((error) => {
      console.log(error)
      alert("Server error / backend not responding")
    }).finally(() => {
      setStatus(false)
      setMessage("")
      setEmailList([])
      if (fileRef.current) {
        fileRef.current.value = ""
      }
    })
  }

  return (<div>
    <div className="bg-blue-950 text-white font-black p-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl text-center">BulkMail</h1>
    </div>
    <div className="bg-blue-800 text-white font-semi-bold p-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl text-center">We can help you sending multiple email by sending once</h2>
    </div>
    <div className="bg-blue-600 text-white font-semi-bold p-6">
      <h3 className="text-xl md:text-2xl text-center">Drag and Drop</h3>
    </div>
    <div className="bg-blue-400 text-white font-semi-bold p-6 flex flex-col justify-center items-center">
      <textarea type="text" value={message} onChange={handleChangeMessage} className="border border-black rounded w-11/12 sm:w-2/3 lg:w-1/2 p-2 h-24 sm:h-40 text-black outline-none" placeholder="Enter the text here" required />
      <input type="file" ref={fileRef} onChange={handleChangeFile} className="border-4 border-white border-dashed p-3 my-5 text-black w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4" />
      <div className={`text-xl font-medium p-2 rounded ${emailList.length === 0 ? "bg-blue-600 opacity-80 cursor-not-allowed" : "bg-blue-950 hover:bg-blue-800"}`}>
        <button disabled={emailList.length === 0} onClick={handleSend}>{status ? "Sending" : "Send"}</button>
      </div>
      <h4 className="my-3 text-black text-lg font-medium">Total Emails in the file: {emailList.length}</h4>
    </div>
    <div className="bg-blue-300 text-white font-semi-bold p-6">
    </div>
    <div className="bg-blue-200 text-white font-semi-bold p-6">
    </div>
  </div>)
}

export default App