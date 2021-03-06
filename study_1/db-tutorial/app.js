// 모듈 추출
const fs = require('fs')
const ejs = require('ejs')
const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')

// 데이터베이스와 연결
const client = mysql.createConnection({
  user: 'root',
  password: '비밀번호', // root 계정에 설정했던 비밀번호 입력
  database: 'Company',
})

// 서버 생성
const app = express()
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)

// 서버 실행
app.listen(52273, function () {
  console.log('server running at http://127.0.0.1:52273')
})

// 라우트 수행
app.get('/', function (request, response) {
  // 파일 읽기
  fs.readFile('list.html', 'utf8', function (error, data) {
    // 데이터베이스 쿼리 실행
    client.query('SELECT * FROM products', function (error, results) {
      // 응답
      response.send(
        ejs.render(data, {
          data: results,
        }),
      )
    })
  })
})
app.get('/delete/:id', function (request, response) {
  // 데이터베이스 쿼리 실행
  client.query(
    'DELETE FROM products WHERE id=?',
    [request.params.id],
    function () {
      // 응답
      response.redirect('/')
    },
  )
})
app.get('/insert', function (request, response) {
  // 파일 읽기
  fs.readFile('insert.html', 'utf8', function (error, data) {
    // 응답
    response.send(data)
  })
})
app.post('/insert', function (request, response) {
  // 변수 선언
  const body = request.body

  // 데이터베이스 쿼리 실행
  client.query(
    'INSERT INTO products (name, modelnumber, series) VALUES (?, ?, ?)',
    [body.name, body.modelnumber, body.series],
    function () {
      // 응답
      response.redirect('/')
    },
  )
})
app.get('/edit/:id', function (request, response) {
  // 파일 읽기
  fs.readFile('edit.html', 'utf8', function (error, data) {
    // 데이터베이스 쿼리 실행
    client.query(
      'SELECT * FROM products WHERE id=?',
      [request.params.id],
      function (error, result) {
        // 응답
        response.send(
          ejs.render(data, {
            data: result[0],
          }),
        )
      },
    )
  })
})
app.post('/edit/:id', function (request, response) {
  // 변수 선언
  const body = request.body

  // 데이터베이스 쿼리 실행
  client.query(
    'UPDATE products SET name=?, modelnumber=?, series=? WHERE id=?',
    [body.name, body.modelnumber, body.series, request.params.id],
    function () {
      // 응답
      response.redirect('/')
    },
  )
})
