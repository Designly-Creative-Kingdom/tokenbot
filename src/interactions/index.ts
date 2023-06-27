import { boardCommand } from "./bounty/board";
import { submitCommand } from "./bounty/submit";
import { balanceCommand } from "./economy/balance";
import { checkinCommand } from "./economy/checkin";
import { bankCommand } from "./utility/bank";
import { configCommand } from "./utility/config";
import { promptCommand } from "./utility/prompt";
import { storeCommand } from "./utility/store";

export const interactions = {
	balance: balanceCommand,
	bank: bankCommand,
	board: boardCommand,
	checkin: checkinCommand,
	config: configCommand,
	prompt: promptCommand,
	submit: submitCommand,
	store: storeCommand
};