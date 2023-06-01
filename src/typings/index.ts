import type {
	AnySelectMenuInteraction,
	AutocompleteInteraction,
	ButtonInteraction,
	ChatInputApplicationCommandData,
	CommandInteraction,
	CommandInteractionOptionResolver,
	EmbedBuilder,
	ModalSubmitFields,
	ModalSubmitInteraction,
	PermissionResolvable,
	UserContextMenuCommandInteraction,
} from 'discord.js';
import { ExtendedClient } from '../structures/Client';

// Logger

export interface LoggerClientOptions {
	timezone: string;
}

export interface LoggerDataOptions {
	source?: 'unhandledRejection' | 'uncaughtException' | 'warning' | any;
	reason?: Error;
	showDate?: boolean;
	space?: boolean;
}

// Command Interaction

export interface excuteOptions {
	client?: ExtendedClient;
	interaction?: CommandInteraction;
	options?: CommandInteractionOptionResolver;
}

export interface buttonExcuteOptions {
	client?: ExtendedClient;
	interaction?: ButtonInteraction;
	options?: Array<string>;

}

export interface modalExecuteOptions {
	client?: ExtendedClient;
	interaction?: ModalSubmitInteraction;
	fields?: ModalSubmitFields;
	options?: Array<String>
}

export interface selectMenuExecuteOptions {
	client?: ExtendedClient;
	interaction?: AnySelectMenuInteraction;
	values?: String[];
	options?: Array<String>
}

export interface autocompleteOptions {
	client?: ExtendedClient;
	interaction?: AutocompleteInteraction;
}

type excuteFunction = (options: excuteOptions) => any;
type buttonExcuteFunction = (options: buttonExcuteOptions) => any;
type modalExecuteFunction = (options: modalExecuteOptions) => any;
type selectMenuExecuteFunction = (options: selectMenuExecuteOptions) => any;
type autocompleteFunction = (options: autocompleteOptions) => any;

type commandDirectories = 'utility' | 'economy' | 'bounty';

export type interactionOptions = {
	name: string;
	description?: string;
	directory: commandDirectories;
	cooldown?: number;
	permission?: PermissionResolvable[];
} & ChatInputApplicationCommandData;

export type commandType = {
	interaction: interactionOptions;
	excute: excuteFunction;
	autocomplete?: autocompleteFunction,
};

export type buttonType = {
	customId: string;
	cooldown?: number;
	permission?: PermissionResolvable[];
	execute: buttonExcuteFunction;
};

export type modalType = {
	customId: string;
	permission?: PermissionResolvable[];
	execute: modalExecuteFunction
}

export type selectMenuType = {
	customId: string;
	permission?: PermissionResolvable[];
	execute: selectMenuExecuteFunction
}

// Discord chat timestamps

export type DiscordTimestampsNames =
	| 'Short Time'
	| 'Long Time'
	| 'Short Date'
	| 'Long Date'
	| 'Short Date/Time'
	| 'Long Date/Time'
	| 'Relative Time';

export enum discordTimestampUnixs {
	'Short Time' = 't',
	'Long Time' = 'T',
	'Short Date' = 'd',
	'Long Date' = 'D',
	'Short Date/Time' = 'f',
	'Long Date/Time' = 'F',
	'Relative Time' = 'R',
}

// Paginator

export type PaginatorInteractionTypes = CommandInteraction | UserContextMenuCommandInteraction | ModalSubmitInteraction;

export interface paginatorOptions {
	array: any[];
	itemPerPage: number;
	joinWith?: string;
	time: number;
	embed: EmbedBuilder;
	ephemeral?: boolean;
	// searchButton: boolean;
}

export interface paginatorStatusOptions {
	totalPages: number;
	currentPage: number;
	slice1: number;
	slice2: number;
}

// Emojis
// Emojis Config

export type EmojisConfigTypes =
	| 'success'
	| 'error'
	| 'attention'
	| 'ping'
	| 'coin'


export interface emojisConfigTypes {
	success: string;
	error: string;
	attention: string;
	coin: string;
}

export enum emojisConfigDefaults {
	success = '✅',
	error = '❌',
	attention = '❗️',
	coin = '🪙'
}

export enum RoleIDs {
	comet = '1060029170710749194',
	supporter = '1060024306815475814',
	serverBooster = '890622688341671997',
	professional = '999429787099603064',
	expert = '999429514050412625',
	advanced = '999429228992925788',
	skilled = '999428975661170698'
}