import { boardCommand } from "./bounty/board";
import { submitCommand } from "./bounty/submit";
import { balanceCommand } from "./economy/balance";
import { bankCommand } from "./utility/bank";
import { configCommand } from "./utility/config";

export const interactions = {
	balance: balanceCommand,
	bank: bankCommand,
	board: boardCommand,
	config: configCommand,
	submit: submitCommand
};