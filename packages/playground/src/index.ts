import { html, render } from "lit-html"
import { unsafeHTML } from "lit-html/directives/unsafe-html"
import { parser as sParser } from "@ryohey/s-parser"
import { moduleParser } from "@ryohey/wat-parser"
import { WASMVirtualMachine, compile } from "@ryohey/wasm-vm"
import * as formatHighlight from "json-format-highlight"

import "./style.css"
import { parseConsoleInput } from "./console-parser"

interface State {
  sParserInput: string
  consoleInput: string
  consoleOutput: string[]
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
  (func $fib (export "fib") (param $p0 i32) (result i32) (local $l0 i32)
    i32.const 1
    set_local $l0
    block $B0
      get_local $p0
      i32.const 2
      i32.lt_u
      br_if $B0
      i32.const 1
      set_local $l0
      loop $L1
        get_local $p0
        i32.const -1
        i32.add
        call $fib
        get_local $l0
        i32.add
        set_local $l0
        get_local $p0
        i32.const -2
        i32.add
        tee_local $p0
        i32.const 1
        i32.gt_u
        br_if $L1
      end
    end
    get_local $l0
  )
)`

const App = () => {
  const { sParserInput, consoleInput, consoleOutput } = store()
  const parsedS = sParser(sParserInput, 0)
  const parsedModule = parsedS[0] ? moduleParser(parsedS[1], 0) : null

  const onChangeText = e => {
    store({ sParserInput: e.target.value })
  }

  const onChangeConsoleInput = e => {
    store({ consoleInput: e.target.value })
  }

  const onKeyPressConsoleInput = e => {
    if (e.key === "Enter") {
      const module = parsedModule[1]
      if (module === null) {
        return
      }

      const { consoleInput, consoleOutput } = store()

      // TODO: evaluate console input
      const vm = new WASMVirtualMachine(compile(module))
      const parsedInput = parseConsoleInput(consoleInput, 0)
      if (!parsedInput[0]) {
        const output = `> ${consoleInput}\ninvalid command: ${parsedInput[3]}`
        store({
          consoleInput: "",
          consoleOutput: [...consoleOutput, output]
        })
        return
      }
      const input = parsedInput[1]
      const result = vm.callFunction(
        input.name,
        ...input.arguments.map(i32 => ({ i32 }))
      )
      const resultStr = result.map(x => JSON.stringify(x)).join(", ")

      const output = `> ${consoleInput}\n${resultStr}`

      store({
        consoleInput: "",
        consoleOutput: [...consoleOutput, output]
      })
    }
  }

  return html`
    <div class="App">
      <h1>Playground</h1>

      <div class="sections">
        <section>
          <h2>Input Text</h2>
          <textarea @input=${onChangeText} .value=${sParserInput}></textarea>
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

        <section>
          <h2>Console</h2>
          <div class="console-content">
            <div class="input-wrapper">
              <span class="mark">&#10095;</span>
              <input
                type="text" 
                .value=${consoleInput} 
                @input=${onChangeConsoleInput}
                @keypress=${onKeyPressConsoleInput}
              />
            </div>
            <div class="section functions">
              <p class="title">functions</p>
              <ul>
              ${parsedModule[1].functions
                .filter(fn => fn.export)
                .map(
                  fn =>
                    html`
                      <li>
                        ${fn.export}(${fn.parameters
                          .map(p => p.type)
                          .join(", ")})
                      </li>
                    `
                )}
              </ul>
            </div>
            <div class="section output">
              <p class="title">output</p>
              ${Code(consoleOutput.join("\n"))}
            </div>
          </div
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
  sParserInput: placeholder,
  consoleInput: "",
  consoleOutput: []
})
renderApp()
