import { Button, Navbar, Alignment, FormGroup, InputGroup } from '@blueprintjs/core';
import "./App.css"

export default function App() {
  return (
    <>
      <div className="App">
        <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>DA2POINTAUC</Navbar.Heading>
            <Navbar.Divider />
            <Button className="bp4-minimal" icon="code" text="Исходный код" />
            <Button className="bp4-minimal" icon="dollar" text="Донат" />
          </Navbar.Group>
        </Navbar>
        <div class="main-app-body">
          <FormGroup
            label="Ссылка на Donationalerts"
            labelFor="text-input"
          >
            <InputGroup id="text-input" placeholder="https://donationalerts.com/r/citinezzz" />
            <div class="centered-submit-button">
              <Button intent="primary" text="Экспортировать" />
            </div>
          </FormGroup>
        </div>
      </div>
    </>

  );
}