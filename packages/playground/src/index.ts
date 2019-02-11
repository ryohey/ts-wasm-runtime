import { html, render } from "lit-html"
import { parser as sParser } from "@ryohey/s-parser"

interface State {
  sParserInput: string
}

let store: (update?: any) => State

const JSONView = json => html`
  <pre><code>${JSON.stringify(json, null, 2)}</code></pre>
`

const Sparser = () => {
  const onChangeText = e => {
    store({ sParserInput: e.target.value })
  }

  const value = store().sParserInput
  const parsed = sParser(value, 0)

  return html`
    <div>
      <h2>S-Expression Parser</h2>
      <textarea @input=${onChangeText} .value=${value}></textarea>
      ${parsed[0]
        ? JSONView(parsed[1])
        : html`
            <div>error: ${parsed[3]}</div>
          `}
    </div>
  `
}

const App = () => html`
  <div>
    <h1>Playground</h1>
    ${Sparser()}
  </div>
`

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
  sParserInput: ""
})
renderApp()
