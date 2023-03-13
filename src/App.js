import { useState } from 'react';
import { Button, Navbar, Alignment, FormGroup, InputGroup } from '@blueprintjs/core';
import "./App.css"

async function getFileFromAPI(link) {
  fetch("/api/main", {
    method: "POST",
    body: JSON.stringify({url: link}),
  }).then((res) => res.json()).then((data) => {
    if (data.error !== undefined) {
      alert(data.error);
    }
    else {
      console.log(data);
      let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
      let downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "subscribers.json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }})
}

export default function App() {
  const [ link, setLink ] = useState("");

  function setLinkFromEvent(e) {
    setLink(e.target.value);
  }

  return (
    <>
      <div className="App">
        <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>DA2POINTAUC</Navbar.Heading>
            <Navbar.Divider />
            <Button className="bp4-minimal" icon="code" text="Исходный код" onClick={
              () => window.open("https://github.com/ivanprogramming/da2pointauc")
            }/>
            <Button className="bp4-minimal" icon="dollar" text="Донат" onClick={
              () => window.open("https://donate.stream/citinez_records")
            }/>
          </Navbar.Group>
        </Navbar>
        <div className="main-app-body">
          <FormGroup
            label="Ссылка на Donationalerts"
            labelFor="text-input"
          >
            <InputGroup id="text-input" placeholder="https://donationalerts.com/r/...."  value={link} onChange={setLinkFromEvent} />
            <div className="left-submit-button"> 
              <Button intent="primary" text="Экспортировать" onClick={() => getFileFromAPI(link)}/>
            </div>
          </FormGroup>
        </div>
        <div className="footer">
          <p>© 2023 IvanProgramming. Hosted on <a href="https://vercel.app">Vercel</a></p>
        </div>
      </div>
    </>

  );
}