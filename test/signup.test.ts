import pgp from "pg-promise";
import { errorMessages } from "../src/errorMessages";

async function clearAccounts() {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		await connection.query("delete from ccca.account");
	} finally {
		await connection.$pool.end();
	}
}; 

async function createAccount( input: any ) {
	const response = await fetch("http://localhost:3000/signup", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify( input )
	} );
	if (!response.ok && (response.status !== 422)) {
		throw new Error('Erro na resposta da API: ' + response.status + ' ' + response.statusText)
	}
	const data = await response.json()
	return data;
}

test("Deve criar a conta de Motorista", async function () {

	await clearAccounts();

	const input = {
    "name": "Kleber Caneva",
    "email": "kleber@gmail.com",
    "cpf": "97456321558",
    "isDriver": true,
    "carPlate": "DZU7755",
    "isPassenger": true,
    "password": "123"
	}

	const data = await createAccount( input );
	const output = (data && data.accountId !== undefined);

	expect(output).toBe(true);
});

test("Deve retornar que a conta já existe", async function () {

	const input = {
    "name": "Kleber Caneva",
    "email": "kleber@gmail.com",
    "cpf": "97456321558",
    "isDriver": true,
    "carPlate": "DZU7755",
    "isPassenger": true,
    "password": "123"
	}

	const data = await createAccount( input );
	const output = data.message; 
	
	expect(output).toBe(errorMessages.ACCOUNT_ALREADY_EXISTS);
});

test("Deve retornar nome inválido", async function () {

	const input = {
    "name": "Kleber",
    "email": "kleber@gmail.com.br",
    "cpf": "97456321558",
    "isDriver": true,
    "carPlate": "DZU7755",
    "isPassenger": true,
    "password": "123"
	}

	const data = await createAccount( input );
	const output = data.message; 
	
	expect(output).toBe(errorMessages.INVALID_NAME);
});

test("Deve retornar email inválido", async function () {

	const input = {
    "name": "Kleber Caneva",
    "email": "teste",
    "cpf": "97456321558",
    "isDriver": true,
    "carPlate": "DZU7755",
    "isPassenger": true,
    "password": "123"
	}

	const data = await createAccount( input );
	const output = data.message; 
	
	expect(output).toBe(errorMessages.INVALID_EMAIL);
});

test("Deve retornar cpf inválido", async function () {

	const input = {
    "name": "Kleber Caneva",
    "email": "kleber@gmail.com.br",
    "cpf": "9745632155",
    "isDriver": true,
    "carPlate": "DZU7755",
    "isPassenger": true,
    "password": "123"
	}

	const data = await createAccount( input );
	const output = data.message; 
	
	expect(output).toBe(errorMessages.INVALID_CPF);
});


test("Deve retornar placa inválida", async function () {

	const input = {
    "name": "Kleber Caneva",
    "email": "kleber@gmail.com.br",
    "cpf": "97456321558",
    "isDriver": true,
    "carPlate": "DZU77",
    "isPassenger": true,
    "password": "123"
	}

	const data = await createAccount( input );
	const output = data.message; 
	
	expect(output).toBe(errorMessages.INVALID_CAR_PLATE);
});
