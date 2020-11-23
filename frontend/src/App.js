import React, { useRef, useState } from 'react';
import './App.css'
import axios from 'axios'

import logo from './assets/images/logo.png'

function App() {

  const [viewResults, setViewResults] = useState(false)
  const [viewTextAreaResults, setViewTextAreaResults] = useState(true)

  const [dataTextArea, setDataTextArea] = useState('')
  const [tableName, setTableName] = useState({})

  const [results, setResults] = useState([])
  const [copied, setCopied] = useState(false)

  const textArea = useRef(null)

  function sendRequestJson(e){

    try{
      const dataEvaled = JSON.parse(dataTextArea)

      if(Array.isArray(dataEvaled)){
        dataEvaled.push(tableName)
      }
      else{
        dataEvaled['tableName'] = tableName['tableName']
      }

      axios.post('http://localhost:3001/json', dataEvaled)
        .then((res) => setResults(res.data.querys))
    }
    catch(error){
      console.log(error.message)
    }
  }

  function sendRequestCsv(e){
    const data = dataTextArea.concat(`\n${tableName['tableName']}`)

    axios.post('http://localhost:3001/csv', data, { headers: { 'Content-Type' : 'text/plain' }})
      .then((res) => setResults(res.data.querys))
      .catch((error) => console.log(error))
  }

  function copyToClipBoard(){
    textArea.current.select() 
    document.execCommand('copy')
    setCopied(true)
  }

  return (
    <div className="App">
      <header className="header">
        <img src={logo} alt="Logo"/>
      </header>
      <div className="container">
        <div className="your-data">
            <div className="header-textarea">
                <h4>Seus Dados</h4>
            </div>
            <textarea name="data" onChange={(e) => setDataTextArea(e.target.value)} />
            <div className="footer">
              <div className="input-group">
                <div className="icon">
                  <i className="fas fa-font"></i>
                </div>
                <input 
                  type="text" 
                  placeholder="Nome da Tabela" 
                  name="tableName"
                  onChange={(e) => setTableName({ tableName: e.target.value })}
                />
              </div>
              <div className="buttons-container">
                <button className="convert-csv" onClick={sendRequestCsv}>CONVERTER CSV</button>
                <button className="convert-json" onClick={sendRequestJson}>CONVERTER JSON</button>
              </div>
            </div>
        </div>
        <div className="sql-scripts">
            <div className="header-textarea">
                <h4>Resultados</h4>
                <div className="buttons-container">
                    <button 
                      className={viewResults ? "btn-lines selected" : "btn-lines"} 
                      onClick={() => { 
                        setViewResults(true)
                        setViewTextAreaResults(false)
                      }}>
                      <i className="fas fa-bars"></i>
                    </button>
                    <button 
                      className={viewTextAreaResults ? "btn-text selected" : "btn-text"} 
                      onClick={() => {
                        setViewTextAreaResults(true)
                        setViewResults(false)
                      }}>
                      <i className="fas fa-font"></i>
                    </button>
                </div>
            </div>
            { viewTextAreaResults && 
              <textarea 
                name="textarea-results" 
                ref={textArea} 
                value={results.map(result => `${result}\n`).join('')}>
              </textarea> }
            {
              viewResults &&
              <div className="results">
                  {
                    results.map((result, index) => 
                      <div key={index} className="script">
                        <h4>{result}</h4>
                      </div>
                    )
                  }
              </div>
            }
            <div className="footer">
              {
                viewTextAreaResults &&
                <button 
                  onClick={copyToClipBoard}
                  className="btn-copy">
                  <i className="fas fa-clone"></i>
                  { copied ? 'Copiado' : 'Copiar' }
                </button>
              }
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
