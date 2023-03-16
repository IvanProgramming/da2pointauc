import { useState } from 'react';
import { Button, Navbar, Alignment, FormGroup, InputGroup } from '@blueprintjs/core';
import "./App.css"

async function getFileFromAPI(link, setLoadingState, setTotal) {
  setLoadingState(true);
  fetch("/api/main", {
    method: "POST",
    body: JSON.stringify({ url: link }),
  }).then((res) => res.json()).then((data) => {
    if (data.error !== undefined) {
      alert(data.error);
    }
    else {
      let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
      let downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "auk.json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      let total = 0;
      data.forEach((item) => {
        total += item.amount;
      });
      setTotal(total);
    }
  }).catch((err) => {
    alert("Произошла ошибка при получении данных с сервера. Попробуйте ещё раз.");
  }).finally(() => {
    setLoadingState(false);
  })
}

export default function App() {
  const [link, setLink] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [total, setTotal] = useState(0);
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
            } />
            <Button className="bp4-minimal" icon="dollar" text="Донат" onClick={
              () => window.open("https://donate.stream/citinez_records")
            } />
          </Navbar.Group>
        </Navbar>
        <div className="main-app-body">
          <FormGroup
            label="Ссылка на Donationalerts"
            labelFor="text-input"
          >
            <InputGroup id="text-input" placeholder="https://donationalerts.com/r/...." value={link} onChange={setLinkFromEvent} />
            <div className="left-submit-button">
              <Button intent="primary" text="Экспортировать" onClick={() => getFileFromAPI(link, setLoadingState, setTotal)} loading={loadingState} />
            </div>
          </FormGroup>
          {total !== 0 && <div className="total">
          <p>Всего своровано: <p className='total-value'>{total} рублей</p><p className='total-value-comment'>А автор не получил и бергера за 200р (биг хит)</p></p>
          </div>}
        </div>
        
        <div className="footer">
          <p>© 2023 IvanProgramming. Hosted on <a href="https://vercel.app">Vercel</a></p>
        </div>
      </div>
    </>

  );
}