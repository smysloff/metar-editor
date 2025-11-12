import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = 3000

class HtmlResource {

  #name
  #url
  #path

  get name() {
    return this.#name
  }

  get url() {
    return this.#url
  }

  get path() {
    return this.#path
  }

  constructor(name, directory = '.') {
    this.#name = name
    this.#url = `/${ name }`
    this.#path = `${ directory }/${ name }`
  }

}

const htmlFile = new HtmlResource('form.min.html', '../build')
const cssFile = new HtmlResource('form.min.css', '../build')
const jsFile = new HtmlResource('form.min.js', '../build')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const template = (bodyContent) => `
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>AMTK Form</title>
  <style>
    body {
      font: 14px Tahoma, Arial, sans-serif;
      margin: 0;
      box-sizing: border-box;
    }
  </style>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="${ cssFile.url }">
  <script src="${ jsFile.url }" defer></script>
</head>
<body>
  ${ bodyContent }
</body>
</html>
`

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/') {
      const formHtml = await fs.readFile(path.join(__dirname, htmlFile.path), 'utf8')
      const page = template(formHtml)
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(page)
    }
    else if (req.url === cssFile.url) {
      const css = await fs.readFile(path.join(__dirname, cssFile.path), 'utf8')
      res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' })
      res.end(css)
    }
    else if (req.url === jsFile.url) {
      const js = await fs.readFile(path.join(__dirname, jsFile.path), 'utf8')
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' })
      res.end(js)
    }
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Страница не найдена')
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Ошибка сервера')
    console.error(err)
  }
})

server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${ PORT }`)
})
