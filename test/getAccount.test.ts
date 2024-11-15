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

async function getAccount( input: any ) {
  const accountId = encodeURIComponent(input.accountId);
	const response = await fetch(`http://localhost:3000/account/${accountId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	} );
	if (!response.ok && (response.status !== 422)) {
		throw new Error('Erro na resposta da API: ' + response.status + ' ' + response.statusText)
	}
	const data = await response.json()
	return data;
}

test("Deve retornar que a conta inválida", async function () {
	const input = {
    accountId: "N/A"
	}

	const data = await getAccount( input );
	const output = data.message; 
	
	expect(output).toBe(errorMessages.INVALID_ACCOUNT);
});


test("Deve retornar que a conta não existe", async function () {
	const input = {
    accountId: "47e2cee2-c370-49bf-992f-6a997820744e"
	}

	const data = await getAccount( input );
	const output = data.message; 
	
	expect(output).toBe(errorMessages.ACCOUNT_NOT_EXISTS);
});
