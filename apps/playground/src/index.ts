import { html, render } from "lit-html"
import { unsafeHTML } from "lit-html/directives/unsafe-html"
import { parser as sParser } from "@ryohey/s-parser"
import { moduleParser as watParser } from "@ryohey/wat-parser"
import {
  WASMVirtualMachine,
  watModuleToWasmModule,
  wasmToVMModule,
} from "@ryohey/wasm-vm"
import { moduleParser as wasmParser } from "@ryohey/wasm-parser"
import formatHighlight from "json-format-highlight"

import "./style.css"
import { parseConsoleInput } from "./console-parser"

enum InputMode {
  text,
  binary,
}

interface State {
  inputMode: InputMode
  wasmBinary: number[]
  sParserInput: string
  consoleInput: string
  consoleOutput: string[]
}

let store: (update?: any) => State

const JSONView = (json) =>
  Code(
    unsafeHTML(
      formatHighlight(json, {
        keyColor: "#c074fb",
        stringColor: "#e3c330",
        nullColor: "#929292",
        numberColor: "white",
        trueColor: "white",
        falseColor: "white",
      })
    )
  )

const Code = (code) => html` <pre class="Code"><code>${code}</code></pre> `

const Error = (message) => html`
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

interface RadioItem<T> {
  data: T
  label: string
}

const RadioSelect = <T>(
  items: RadioItem<T>[],
  name: String,
  value: T,
  onSelect: (item: T) => void
) =>
  items.map((item, i) => {
    const id = `${name}-${i}`
    return html`
      <input
        type="radio"
        name=${name}
        id=${id}
        .checked=${item.data === value}
        @change=${() => onSelect(item.data)}
      />
      <label for=${id}>${item.label}</label>
    `
  })

const App = () => {
  const {
    sParserInput,
    consoleInput,
    consoleOutput,
    inputMode,
    wasmBinary,
  } = store()
  const parsedS = sParser(sParserInput, 0)
  const watModule = parsedS[0] ? watParser(parsedS[1], 0) : null

  const wasmHexString = wasmBinary
    ? wasmBinary.map((n) => n.toString(16)).join(" ")
    : ""
  const wasmModule = wasmBinary ? wasmParser(wasmBinary, 0) : null
  const module = (() => {
    switch (inputMode) {
      case InputMode.text:
        return watModule !== null && watModule[0]
          ? watModuleToWasmModule(watModule[1])
          : null
      case InputMode.binary:
        return wasmModule !== null && wasmModule[0]
          ? wasmToVMModule(wasmModule[1])
          : null
    }
  })()

  const onChangeText = (e) => {
    store({ sParserInput: e.target.value })
  }

  const onChangeConsoleInput = (e) => {
    store({ consoleInput: e.target.value })
  }

  const onKeyPressConsoleInput = (e) => {
    if (e.key === "Enter") {
      if (module === null) {
        return
      }

      const { consoleInput, consoleOutput } = store()

      const vm = new WASMVirtualMachine(module)
      const parsedInput = parseConsoleInput(consoleInput, 0)
      if (!parsedInput[0]) {
        const output = `> ${consoleInput}\ninvalid command: ${parsedInput[3]}`
        store({
          consoleInput: "",
          consoleOutput: [...consoleOutput, output],
        })
        return
      }
      const input = parsedInput[1]
      const result = vm.callFunction(
        input.name,
        ...input.arguments.map((i32) => ({ i32: parseInt(i32) }))
      )
      const resultStr = result.map((x) => JSON.stringify(x)).join(", ")

      const output = `> ${consoleInput}\n${resultStr}`

      store({
        consoleInput: "",
        consoleOutput: [...consoleOutput, output],
      })
    }
  }

  const onChangeFile = (e: Event) => {
    const reader = new FileReader()
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer
      const array = Array.from(new Uint8Array(arrayBuffer))
      store({
        wasmBinary: array,
      })
    }
    reader.readAsArrayBuffer((e.currentTarget as HTMLInputElement).files[0])
  }

  const onSelectInputMode = (inputMode: InputMode) => store({ inputMode })

  return html`
    <div class="App">
      <h1>Playground</h1>

      <div class="mode">
        ${RadioSelect(
          [
            {
              label: "Text",
              data: InputMode.text,
            },
            {
              label: "Binary",
              data: InputMode.binary,
            },
          ],
          "input-select",
          inputMode,
          onSelectInputMode
        )}
      </div>

      <div class="sections">
        ${
          inputMode === InputMode.text
            ? html`
                <section>
                  <h2>Input Text</h2>
                  <textarea
                    @input=${onChangeText}
                    .value=${sParserInput}
                  ></textarea>
                </section>

                <section>
                  <h2>S-Expression Parser</h2>
                  ${parsedS[0] ? JSONView(parsedS[1]) : Error(parsedS[3])}
                </section>

                <section>
                  <h2>WebAssembly Text Format Parser</h2>
                  ${watModule &&
                  (watModule[0] ? JSONView(watModule[1]) : Error(watModule[3]))}
                </section>
              `
            : null
        }

        ${
          inputMode === InputMode.binary
            ? html`
                <section>
                  <h2>Open .wasm file</h2>
                  <div class="file-input">
                    <input type="file" accept=".wasm" @change=${onChangeFile} />
                    ${Code(wasmHexString)}
                  </div>
                </section>

                <section>
                  <h2>WebAssembly Binary Format Parser</h2>
                  ${wasmModule &&
                  (wasmModule[0]
                    ? JSONView(wasmModule[1])
                    : Error(wasmModule[3]))}
                </section>
              `
            : null
        }

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
              ${
                module !== null
                  ? module.functions
                      .filter((fn) => fn.export)
                      .map(
                        (fn) =>
                          html`
                            <li>${fn.export}(${fn.parameters.join(", ")})</li>
                          `
                      )
                  : null
              }
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
  inputMode: InputMode.text,
  wasmBinary: null,
  sParserInput: placeholder,
  consoleInput: "",
  consoleOutput: [],
})
renderApp()
