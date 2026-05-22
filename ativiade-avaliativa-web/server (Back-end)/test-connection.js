const http = require('http');
const mysql = require('mysql2/promise');
require('dotenv').config();

const SERVER_HOST = 'localhost';
const SERVER_PORT = process.env.PORT || 3001;
const SERVER_ROOT = '/';
const REGISTER_PATH = '/auth/register';
const LOGIN_PATH = '/auth/login';

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let raw = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        raw += chunk;
      });
      res.on('end', () => {
        let data = raw;
        const contentType = res.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
          try {
            data = JSON.parse(raw);
          } catch (error) {
            return reject(new Error('Resposta JSON inválida: ' + raw));
          }
        }
        resolve({ statusCode: res.statusCode, data, raw });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function testMySQL() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'atividadedb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const connection = await pool.getConnection();
  connection.release();
  console.log('✅ Conectado ao MySQL com sucesso!');
  console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`Usuário: ${process.env.DB_USER || 'root'}`);
  console.log(`Banco: ${process.env.DB_NAME || 'atividadedb'}`);
}

async function testServerRoot() {
  const response = await request({
    hostname: SERVER_HOST,
    port: SERVER_PORT,
    path: SERVER_ROOT,
    method: 'GET',
  });

  if (response.statusCode === 200) {
    console.log('✅ Servidor HTTP respondeu corretamente no root.');
  } else {
    throw new Error(`Serviço HTTP retornou status ${response.statusCode}`);
  }
}

async function testRegisterAndLogin(role) {
  const timestamp = Date.now();
  const email = `${role}.${timestamp}@teste.com`;
  const password = 'Teste123!';
  const name = `Usuario ${role}`;

  const registerPayload = JSON.stringify({
    name,
    email,
    password,
    role,
  });

  const registerResponse = await request({
    hostname: SERVER_HOST,
    port: SERVER_PORT,
    path: REGISTER_PATH,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(registerPayload),
    },
  }, registerPayload);

  if ([201, 409].includes(registerResponse.statusCode)) {
    if (registerResponse.statusCode === 201) {
      console.log(`✅ Registro de usuário (${role}) realizado com sucesso.`);
    } else {
      console.log(`ℹ️ Usuário (${role}) já existente no teste.`);
    }
  } else {
    throw new Error(`Falha no registro (${role}): ${registerResponse.statusCode} ${JSON.stringify(registerResponse.data)}`);
  }

  const loginPayload = JSON.stringify({
    email,
    password,
  });

  const loginResponse = await request({
    hostname: SERVER_HOST,
    port: SERVER_PORT,
    path: LOGIN_PATH,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginPayload),
    },
  }, loginPayload);

  if (loginResponse.statusCode === 200 && loginResponse.data && loginResponse.data.user) {
    console.log(`✅ Login de usuário (${role}) realizado com sucesso.`);
    console.log(`Usuário retornado: ${loginResponse.data.user.name} (${loginResponse.data.user.role})`);
  } else {
    throw new Error(`Falha no login (${role}): ${loginResponse.statusCode} ${JSON.stringify(loginResponse.data)}`);
  }
}

async function runTests() {
  try {
    console.log('Iniciando testes de conexão...');
    await testMySQL();
    await testServerRoot();
    await testRegisterAndLogin('student');
    await testRegisterAndLogin('teacher');
    console.log('✅ Todos os testes concluídos com sucesso.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
    process.exit(1);
  }
}

runTests();
