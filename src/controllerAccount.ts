import pgp from "pg-promise";

import { AccountData } from "./accountData";
import { Account } from "./account";
import { errorMessages } from "./errorMessages";

export async function controllerAccount(req: any, res: any) {
  const input: Input = req.params;
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
    if (!input.accountId.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)) throw new Error(errorMessages.INVALID_ACCOUNT);
    const acc: AccountData = await connection.query("select * from ccca.account where account_id = $1", [input.accountId]);
    if (!acc.account_id) throw new Error(errorMessages.ACCOUNT_NOT_EXISTS);
    const account: Account = {
      accountId: acc.account_id,	
      name: acc.name,
      email: acc.email,
      cpf: acc.cpf,
      isDriver: acc.is_driver,
      carPlate: acc.car_plate,
      isPassenger: acc.is_passenger,
      password: acc.password
    }
    res.json(account);
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : 'Unknown error';
  	res.status(422).json({ message: errorMessage });
	} finally {
		await connection.$pool.end();
	}
}

type Input = {
  accountId: string
}

type Output = {
  accountId: string,
	name: string,
	email: string,
	cpf: string,
	isDriver: boolean,
	carPlate: string,
	isPassenger: boolean,
	password: string,
}