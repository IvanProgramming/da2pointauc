import { useState } from 'react';
import { Button, Navbar, Alignment, FormGroup, InputGroup } from '@blueprintjs/core';
import "./App.css"

async function getFileFromAPI(link) {
  console.log("Getting file from API", link);
}

export default function App() {
  const [ fileUploaded, setFileUploaded ] = useState(false);
  const [ file, setFile ] = useState(null);
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
      </div>
    </>

  );
}