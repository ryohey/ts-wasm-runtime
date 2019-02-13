import { html, render } from "lit-html"
import { unsafeHTML } from "lit-html/directives/unsafe-html"
import { parser as sParser } from "@ryohey/s-parser"
import { moduleParser } from "@ryohey/wat-parser"
import * as formatHighlight from "json-format-highlight"

import "./style.css"

interface State {
  sParserInput: string
}

let store: (update?: any) => State

const JSONView = json =>
  Code(
    unsafeHTML(
      formatHighlight(json, {
        keyColor: "#c074fb",
        stringColor: "#e3c330",
        nullColor: "#929292",
        numberColor: "white",
        trueColor: "white",
        falseColor: "white"
      })
    )
  )

const Code = code => html`
  <pre class="Code"><code>${code}</code></pre>
`

const Error = message => html`
  <pre class="Code Error"><code>${message}</code></pre>
`

const placeholder = `(module 
  (func (export "add") (param i32) (param i32) (result i32)
    get_local 0 
    get_local 1
    i32.add
  )
)`

const App = () => {
  const onChangeText = e => {
    store({ sParserInput: e.target.value })
  }

  const value = store().sParserInput
  const parsedS = sParser(value, 0)
  const parsedModule = parsedS[0] ? moduleParser(parsedS[1], 0) : null

  return html`
    <div class="App">
      <h1>Playground</h1>

      <div class="sections">
        <section>
          <h2>Input Text</h2>
          <textarea @input=${onChangeText} .value=${value}></textarea>
        </section>

        <section>
          <h2>S-Expression Parser</h2>
          ${parsedS[0] ? JSONView(parsedS[1]) : Error(parsedS[3])}
        </section>
        <section>
          <h2>WebAssembly Text Format Parser</h2>
          ${parsedModule &&
            (parsedModule[0]
              ? JSONView(parsedModule[1])
              : Error(parsedModule[3]))}
        </section>
      </div>
    </div>
  `
}

const renderApp = () => render(App(), document.body)

const createStore = <T>(initialState: T) => {
  let data = initialState

  return (update: any = null) => {
    if (update) {
      data = { ...data, ...update }
      renderApp()
    }
    return data
  }
}

store = createStore({
  sParserInput: placeholder
})
renderApp()