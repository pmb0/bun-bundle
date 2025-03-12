# @pmb0/bundle

Bundles a Node.js application into a single file using [Bun](https://bun.sh/).

```sh
bunx @pmb0/bundle
```

or

```sh
# Generate a standalone Bun executable
bunx @pmb0/bundle --compile
```


```
Usage: @pmb0/bundle [options] [entrypoint]

Bundle Node.js application

Arguments:
  entrypoint                 entrypoint file (default: "./src/main.ts")

Options:
  -V, --version              output the version number
  -c, --compile              Generate a standalone Bun executable containing
                             your bundled code (default: false)
  -t, --target <target>      Target platform (choices: "bun-linux-x64",
                             "bun-linux-arm64", "bun-windows-x64",
                             "bun-windows-arm64", "bun-darwin-x64",
                             "bun-darwin-arm64", "bun-linux-x64-musl",
                             "bun-linux-arm64-musl", default: current platform)
  -o, --outdir <outdir>      Output file (default: "./build")
  --conditions <conditions>  Build conditions
  -h, --help                 display help for command
```