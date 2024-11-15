import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";
import { errorMessages } from "./errorMessages";

export async function controllerSignup(req: any, res: any) {
  const input: Input = req.body;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		validadeInput(input)
  	await validateAccountExists(connection, input.email)
		const id = crypto.randomUUID();
		await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
		res.json({ accountId: id });
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : 'Unknown error';
  	res.status(422).json({ message: errorMessage });
	} finally {
		await connection.$pool.end();
	}
}

function validadeInput(input: Input) {
	if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error(errorMessages.INVALID_NAME);
	if (!input.email.match(/^(.+)@(.+)$/))  throw new Error(errorMessages.INVALID_EMAIL);
	if (!validateCpf(input.cpf)) throw new Error(errorMessages.INVALID_CPF);
	if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error(errorMessages.INVALID_CAR_PLATE);
}

async function validateAccountExists(connection:any, email: string) {
	const [acc] = await connection.query("select * from ccca.account where email = $1", [email]);
	if (acc) throw new Error(errorMessages.ACCOUNT_ALREADY_EXISTS);
}

type Input = {
	name: string,
	email: string,
	cpf: string,
	isDriver: boolean,
	carPlate: string,
	isPassenger: boolean,
	password: string,
}

type Output = {
	accountId: string
}