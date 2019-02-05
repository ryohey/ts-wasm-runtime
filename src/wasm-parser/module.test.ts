import * as assert from "assert"
import * as fs from "fs"
import { moduleParser, elemSection, exportSection } from "./module"

describe("module", () => {
  it("parses file", () => {
    const wasm = Array.from(fs.readFileSync("./src/wasm-parser/main.wasm"))
    const r = moduleParser(wasm, 0)
    assert.deepStrictEqual(r, [
      true,
      [
        {
          version: 1
        },
        [
          {
            id: 1,
            nodeType: "type",
            sections: [
              {
                parameters: ["i32", "i32"],
                results: []
              },
              {
                parameters: [],
                results: ["i32"]
              },
              {
                parameters: ["i32", "i32"],
                results: ["i32"]
              },
              {
                parameters: ["i32", "i32", "i32"],
                results: []
              },
              {
                parameters: ["i32", "i32", "i32"],
                results: ["i32"]
              },
              {
                parameters: ["i32"],
                results: ["i32"]
              },
              {
                parameters: [],
                results: []
              }
            ],
            size: 37
          }
        ],
        [
          {
            id: 2,
            nodeType: "import",
            sections: [
              {
                desc: {
                  func: 0
                },
                module: "console",
                name: "log"
              }
            ],
            size: 15
          }
        ],
        [
          {
            id: 3,
            nodeType: "func",
            sections: [1, 1, 2, 3, 2, 2, 4, 2, 3, 0, 5, 6, 6, 6],
            size: 15
          }
        ],
        [
          {
            id: 4,
            nodeType: "table",
            sections: [
              {
                type: {
                  funcref: 112,
                  lim: {
                    min: 16
                  }
                }
              }
            ],
            size: 4
          }
        ],
        [
          {
            id: 5,
            nodeType: "mem",
            sections: [
              {
                type: {
                  lim: {
                    min: 1
                  }
                }
              }
            ],
            size: 3
          }
        ],
        [
          {
            id: 7,
            nodeType: "export",
            sections: [
              {
                desc: {
                  func: 14
                },
                name: "tick"
              },
              {
                desc: {
                  func: 13
                },
                name: "promoteNextGeneration"
              },
              {
                desc: {
                  func: 12
                },
                name: "evolveAllCells"
              },
              {
                desc: {
                  func: 10
                },
                name: "evolveCellToNextGeneration"
              },
              {
                desc: {
                  func: 9
                },
                name: "setCellStateForNextGeneration"
              },
              {
                desc: {
                  func: 8
                },
                name: "isCellAlive"
              },
              {
                desc: {
                  func: 7
                },
                name: "inRange"
              },
              {
                desc: {
                  func: 3
                },
                name: "offsetFromCoordinate"
              },
              {
                desc: {
                  func: 6
                },
                name: "liveNeighbourCount"
              },
              {
                desc: {
                  func: 5
                },
                name: "getCell"
              },
              {
                desc: {
                  func: 4
                },
                name: "setCell"
              },
              {
                desc: {
                  mem: 0
                },
                name: "memory"
              }
            ],
            size: 207
          }
        ],
        [
          {
            id: 9,
            nodeType: "elem",
            sections: [
              {
                init: [2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2],
                offset: [
                  {
                    opType: "i32.const",
                    parameter: 0
                  }
                ],
                table: 0
              }
            ],
            size: 22
          }
        ],
        [
          {
            id: 10,
            nodeType: "code",
            sections: [
              {
                code: [
                  [],
                  [
                    {
                      opType: "i32.const",
                      parameter: 1
                    }
                  ]
                ],
                size: 4
              },
              {
                code: [
                  [],
                  [
                    {
                      opType: "i32.const",
                      parameter: 0
                    }
                  ]
                ],
                size: 4
              },
              {
                code: [
                  [],
                  [
                    {
                      opType: "i32.const",
                      parameter: 200
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      opType: "i32.mul"
                    },
                    {
                      opType: "i32.const",
                      parameter: 4
                    },
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "i32.mul"
                    },
                    {
                      opType: "i32.add"
                    }
                  ]
                ],
                size: 14
              },
              {
                code: [
                  [],
                  [
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      funcIndex: 3,
                      opType: "call"
                    },
                    {
                      opType: "local.get",
                      parameter: 2
                    },
                    {
                      opType: "i32.store",
                      parameter: {
                        align: 2,
                        offset: 0
                      }
                    }
                  ]
                ],
                size: 13
              },
              {
                code: [
                  [],
                  [
                    {
                      body: [
                        {
                          opType: "i32.const",
                          parameter: 0
                        },
                        {
                          opType: "i32.const",
                          parameter: 50
                        },
                        {
                          opType: "local.get",
                          parameter: 0
                        },
                        {
                          funcIndex: 7,
                          opType: "call"
                        },
                        {
                          opType: "i32.const",
                          parameter: 0
                        },
                        {
                          opType: "i32.const",
                          parameter: 50
                        },
                        {
                          opType: "local.get",
                          parameter: 1
                        },
                        {
                          funcIndex: 7,
                          opType: "call"
                        },
                        {
                          opType: "i32.and"
                        }
                      ],
                      opType: "block",
                      results: ["i32"]
                    },
                    {
                      else: [
                        {
                          opType: "local.get",
                          parameter: 0
                        },
                        {
                          opType: "local.get",
                          parameter: 1
                        },
                        {
                          funcIndex: 3,
                          opType: "call"
                        },
                        {
                          opType: "i32.load8_u",
                          parameter: {
                            align: 0,
                            offset: 0
                          }
                        }
                      ],
                      opType: "if",
                      results: ["i32"],
                      then: [
                        {
                          opType: "local.get",
                          parameter: 0
                        },
                        {
                          opType: "local.get",
                          parameter: 1
                        },
                        {
                          funcIndex: 3,
                          opType: "call"
                        },
                        {
                          opType: "i32.load8_u",
                          parameter: {
                            align: 0,
                            offset: 0
                          }
                        }
                      ]
                    }
                  ]
                ],
                size: 37
              },
              {
                code: [
                  [],
                  [
                    {
                      opType: "i32.const",
                      parameter: 0
                    },
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "i32.const",
                      parameter: 1
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      funcIndex: 8,
                      opType: "call"
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "i32.const",
                      parameter: 127
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      funcIndex: 8,
                      opType: "call"
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      opType: "i32.const",
                      parameter: 127
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      funcIndex: 8,
                      opType: "call"
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "i32.const",
                      parameter: 127
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      opType: "i32.const",
                      parameter: 127
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      funcIndex: 8,
                      opType: "call"
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "i32.const",
                      parameter: 1
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      opType: "i32.const",
                      parameter: 127
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      funcIndex: 8,
                      opType: "call"
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      opType: "i32.const",
                      parameter: 1
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      funcIndex: 8,
                      opType: "call"
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "i32.const",
                      parameter: 127
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      opType: "i32.const",
                      parameter: 1
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      funcIndex: 8,
                      opType: "call"
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "i32.const",
                      parameter: 1
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      opType: "i32.const",
                      parameter: 1
                    },
                    {
                      opType: "i32.add"
                    },
                    {
                      funcIndex: 8,
                      opType: "call"
                    },
                    {
                      opType: "i32.add"
                    }
                  ]
                ],
                size: 96
              },
              {
                code: [
                  [],
                  [
                    {
                      opType: "local.get",
                      parameter: 2
                    },
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "i32.ge_s"
                    },
                    {
                      opType: "local.get",
                      parameter: 2
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      opType: "i32.lt_s"
                    },
                    {
                      opType: "i32.and"
                    }
                  ]
                ],
                size: 13
              },
              {
                code: [
                  [],
                  [
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      funcIndex: 5,
                      opType: "call"
                    },
                    {
                      opType: "i32.const",
                      parameter: 1
                    },
                    {
                      opType: "i32.and"
                    }
                  ]
                ],
                size: 11
              },
              {
                code: [
                  [],
                  [
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      funcIndex: 8,
                      opType: "call"
                    },
                    {
                      opType: "local.get",
                      parameter: 2
                    },
                    {
                      opType: "i32.const",
                      parameter: 1
                    },
                    {
                      opType: "i32.shl"
                    },
                    {
                      opType: "i32.or"
                    },
                    {
                      funcIndex: 4,
                      opType: "call"
                    }
                  ]
                ],
                size: 20
              },
              {
                code: [
                  [],
                  [
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      opType: "i32.const",
                      parameter: 8
                    },
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      funcIndex: 8,
                      opType: "call"
                    },
                    {
                      opType: "i32.mul"
                    },
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "local.get",
                      parameter: 1
                    },
                    {
                      funcIndex: 6,
                      opType: "call"
                    },
                    {
                      opType: "i32.or"
                    },
                    {
                      opType: "call_indirect",
                      typeIndex: 1
                    },
                    {
                      funcIndex: 9,
                      opType: "call"
                    }
                  ]
                ],
                size: 27
              },
              {
                code: [
                  [],
                  [
                    {
                      opType: "local.get",
                      parameter: 0
                    },
                    {
                      opType: "i32.const",
                      parameter: 1
                    },
                    {
                      opType: "i32.add"
                    }
                  ]
                ],
                size: 7
              },
              {
                code: [
                  [[2, "i32"]],
                  [
                    {
                      opType: "i32.const",
                      parameter: 0
                    },
                    {
                      opType: "local.set",
                      parameter: 1
                    },
                    {
                      body: [
                        {
                          body: [
                            {
                              opType: "i32.const",
                              parameter: 0
                            },
                            {
                              opType: "local.set",
                              parameter: 0
                            },
                            {
                              body: [
                                {
                                  body: [
                                    {
                                      opType: "local.get",
                                      parameter: 0
                                    },
                                    {
                                      opType: "local.get",
                                      parameter: 1
                                    },
                                    {
                                      funcIndex: 10,
                                      opType: "call"
                                    },
                                    {
                                      opType: "local.get",
                                      parameter: 0
                                    },
                                    {
                                      funcIndex: 11,
                                      opType: "call"
                                    },
                                    {
                                      opType: "local.set",
                                      parameter: 0
                                    },
                                    {
                                      opType: "local.get",
                                      parameter: 0
                                    },
                                    {
                                      opType: "i32.const",
                                      parameter: 50
                                    },
                                    {
                                      opType: "i32.eq"
                                    },
                                    {
                                      label: 1,
                                      opType: "br_if"
                                    },
                                    {
                                      label: 0,
                                      opType: "br"
                                    }
                                  ],
                                  opType: "loop",
                                  results: []
                                }
                              ],
                              opType: "block",
                              results: []
                            },
                            {
                              opType: "local.get",
                              parameter: 1
                            },
                            {
                              funcIndex: 11,
                              opType: "call"
                            },
                            {
                              opType: "local.set",
                              parameter: 1
                            },
                            {
                              opType: "local.get",
                              parameter: 1
                            },
                            {
                              opType: "i32.const",
                              parameter: 50
                            },
                            {
                              opType: "i32.eq"
                            },
                            {
                              label: 1,
                              opType: "br_if"
                            },
                            {
                              label: 0,
                              opType: "br"
                            }
                          ],
                          opType: "loop",
                          results: []
                        }
                      ],
                      opType: "block",
                      results: []
                    }
                  ]
                ],
                size: 60
              },
              {
                code: [
                  [[2, "i32"]],
                  [
                    {
                      opType: "i32.const",
                      parameter: 0
                    },
                    {
                      opType: "local.set",
                      parameter: 1
                    },
                    {
                      body: [
                        {
                          body: [
                            {
                              opType: "i32.const",
                              parameter: 0
                            },
                            {
                              opType: "local.set",
                              parameter: 0
                            },
                            {
                              body: [
                                {
                                  body: [
                                    {
                                      opType: "local.get",
                                      parameter: 0
                                    },
                                    {
                                      opType: "local.get",
                                      parameter: 1
                                    },
                                    {
                                      opType: "local.get",
                                      parameter: 0
                                    },
                                    {
                                      opType: "local.get",
                                      parameter: 1
                                    },
                                    {
                                      funcIndex: 5,
                                      opType: "call"
                                    },
                                    {
                                      opType: "i32.const",
                                      parameter: 1
                                    },
                                    {
                                      opType: "i32.shr_u"
                                    },
                                    {
                                      funcIndex: 4,
                                      opType: "call"
                                    },
                                    {
                                      opType: "local.get",
                                      parameter: 0
                                    },
                                    {
                                      funcIndex: 11,
                                      opType: "call"
                                    },
                                    {
                                      opType: "local.set",
                                      parameter: 0
                                    },
                                    {
                                      opType: "local.get",
                                      parameter: 0
                                    },
                                    {
                                      opType: "i32.const",
                                      parameter: 50
                                    },
                                    {
                                      opType: "i32.eq"
                                    },
                                    {
                                      label: 1,
                                      opType: "br_if"
                                    },
                                    {
                                      label: 0,
                                      opType: "br"
                                    }
                                  ],
                                  opType: "loop",
                                  results: []
                                }
                              ],
                              opType: "block",
                              results: []
                            },
                            {
                              opType: "local.get",
                              parameter: 1
                            },
                            {
                              funcIndex: 11,
                              opType: "call"
                            },
                            {
                              opType: "local.set",
                              parameter: 1
                            },
                            {
                              opType: "local.get",
                              parameter: 1
                            },
                            {
                              opType: "i32.const",
                              parameter: 50
                            },
                            {
                              opType: "i32.eq"
                            },
                            {
                              label: 1,
                              opType: "br_if"
                            },
                            {
                              label: 0,
                              opType: "br"
                            }
                          ],
                          opType: "loop",
                          results: []
                        }
                      ],
                      opType: "block",
                      results: []
                    }
                  ]
                ],
                size: 69
              },
              {
                code: [
                  [],
                  [
                    {
                      funcIndex: 12,
                      opType: "call"
                    },
                    {
                      funcIndex: 13,
                      opType: "call"
                    }
                  ]
                ],
                size: 6
              }
            ],
            size: 396
          }
        ],
        [
          {
            id: 0,
            nodeType: "custom",
            sections: [],
            size: 355
          }
        ]
      ],
      1083
    ])
  })

  it("parses elem", () => {
    const wasm = [
      9,
      22,
      1,
      0,
      65,
      0,
      11,
      16,
      2,
      2,
      2,
      1,
      2,
      2,
      2,
      2,
      2,
      2,
      1,
      1,
      2,
      2,
      2,
      2,
      10,
      140,
      3
    ]
    const r = elemSection(wasm, 0)
    assert.deepStrictEqual(r, [
      true,
      {
        id: 9,
        nodeType: "elem",
        sections: [
          {
            init: [2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2],
            offset: [{ opType: "i32.const", parameter: 0 }],
            table: 0
          }
        ],
        size: 22
      },
      24
    ])
  })

  it("parses export", () => {
    const input = [
      0x07,
      0xcf,
      0x01,
      0x0c,
      0x04,
      0x74,
      0x69,
      0x63,
      0x6b,
      0x00,
      0x0e,
      0x15,
      0x70,
      0x72,
      0x6f,
      0x6d,
      0x6f,
      0x74,
      0x65,
      0x4e,
      0x65,
      0x78,
      0x74,
      0x47,
      0x65,
      0x6e,
      0x65,
      0x72,
      0x61,
      0x74,
      0x69,
      0x6f,
      0x6e,
      0x00,
      0x0d,
      0x0e,
      0x65,
      0x76,
      0x6f,
      0x6c,
      0x76,
      0x65,
      0x41,
      0x6c,
      0x6c,
      0x43,
      0x65,
      0x6c,
      0x6c,
      0x73,
      0x00,
      0x0c,
      0x1a,
      0x65,
      0x76,
      0x6f,
      0x6c,
      0x76,
      0x65,
      0x43,
      0x65,
      0x6c,
      0x6c,
      0x54,
      0x6f,
      0x4e,
      0x65,
      0x78,
      0x74,
      0x47,
      0x65,
      0x6e,
      0x65,
      0x72,
      0x61,
      0x74,
      0x69,
      0x6f,
      0x6e,
      0x00,
      0x0a,
      0x1d,
      0x73,
      0x65,
      0x74,
      0x43,
      0x65,
      0x6c,
      0x6c,
      0x53,
      0x74,
      0x61,
      0x74,
      0x65,
      0x46,
      0x6f,
      0x72,
      0x4e,
      0x65,
      0x78,
      0x74,
      0x47,
      0x65,
      0x6e,
      0x65,
      0x72,
      0x61,
      0x74,
      0x69,
      0x6f,
      0x6e,
      0x00,
      0x09,
      0x0b,
      0x69,
      0x73,
      0x43,
      0x65,
      0x6c,
      0x6c,
      0x41,
      0x6c,
      0x69,
      0x76,
      0x65,
      0x00,
      0x08,
      0x07,
      0x69,
      0x6e,
      0x52,
      0x61,
      0x6e,
      0x67,
      0x65,
      0x00,
      0x07,
      0x14,
      0x6f,
      0x66,
      0x66,
      0x73,
      0x65,
      0x74,
      0x46,
      0x72,
      0x6f,
      0x6d,
      0x43,
      0x6f,
      0x6f,
      0x72,
      0x64,
      0x69,
      0x6e,
      0x61,
      0x74,
      0x65,
      0x00,
      0x03,
      0x12,
      0x6c,
      0x69,
      0x76,
      0x65,
      0x4e,
      0x65,
      0x69,
      0x67,
      0x68,
      0x62,
      0x6f,
      0x75,
      0x72,
      0x43,
      0x6f,
      0x75,
      0x6e,
      0x74,
      0x00,
      0x06,
      0x07,
      0x67,
      0x65,
      0x74,
      0x43,
      0x65,
      0x6c,
      0x6c,
      0x00,
      0x05,
      0x07,
      0x73,
      0x65,
      0x74,
      0x43,
      0x65,
      0x6c,
      0x6c,
      0x00,
      0x04,
      0x06,
      0x6d,
      0x65,
      0x6d,
      0x6f,
      0x72,
      0x79,
      0x02,
      0x00
    ]
    const r = exportSection(input, 0)
    assert.deepStrictEqual(r, [
      true,
      {
        id: 7,
        nodeType: "export",
        sections: [
          { desc: { func: 14 }, name: "tick" },
          { desc: { func: 13 }, name: "promoteNextGeneration" },
          { desc: { func: 12 }, name: "evolveAllCells" },
          { desc: { func: 10 }, name: "evolveCellToNextGeneration" },
          { desc: { func: 9 }, name: "setCellStateForNextGeneration" },
          { desc: { func: 8 }, name: "isCellAlive" },
          { desc: { func: 7 }, name: "inRange" },
          { desc: { func: 3 }, name: "offsetFromCoordinate" },
          { desc: { func: 6 }, name: "liveNeighbourCount" },
          { desc: { func: 5 }, name: "getCell" },
          { desc: { func: 4 }, name: "setCell" },
          { desc: { mem: 0 }, name: "memory" }
        ],
        size: 207
      },
      210
    ])
  })
})
