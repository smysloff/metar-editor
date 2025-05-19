import http from 'http'
import fs from 'fs/promises' // промисифицированный fs
import path from 'path'
import { fileURLToPath } from 'url'

const PORT = 3000

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
      font: 18px monospace;
      margin: 0;
      box-sizing: border-box;
    }
  </style>
  <link rel="stylesheet" href="/amtk_form.css">
  <script src="/amtk_form.min.js" defer></script>
</head>
<body>
  ${bodyContent}
</body>
</html>
`

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/') {
      const formHtml = await fs.readFile(path.join(__dirname, '../dist/amtk_form.html'), 'utf8')
      const page = template(formHtml)
      res.writeHead(200, { 'Content-Type': 'text/html charset=utf-8' })
      res.end(page)
    }
    else if (req.url === '/amtk_form.css') {
      const css = await fs.readFile(path.join(__dirname, '../dist/_amtk_form.scss'))
      res.writeHead(200, { 'Content-Type': 'text/css' })
      res.end(css)
    }
    else if (req.url === '/amtk_form.min.js') {
      const js = await fs.readFile(path.join(__dirname, '../dist/amtk_form.min.js'))
      res.writeHead(200, { 'Content-Type': 'application/javascript' })
      res.end(js)
    }
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain charset=utf-8' })
      res.end('Страница не найдена')
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain charset=utf-8' })
    res.end('Ошибка сервера')
    console.error(err)
  }
})

server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
})
