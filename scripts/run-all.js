const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")

const isDirectory = source => 
  fs.lstatSync(source).isDirectory()

const getDirectories = source =>
  fs.readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory)

const files = getDirectories("./packages").filter(isDirectory)

const command1 = process.argv[2]
const command2 = process.argv[3]

files.forEach(cwd => 
  spawn(process.argv[2], process.argv.slice(3), { cwd, stdio: "inherit" })
)
