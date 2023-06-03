import { Client, Collection, ClientEvents, GatewayIntentBits, Partials, ActivityType } from 'discord.js';
import { buttonType, commandType, modalType, selectMenuType } from '../typings';
import { Event } from './Event';
import { readdirSync } from 'fs';
import { cc, clientEmbeds,  } from '../functions/other/client';
import { Config } from './Config';
import { connect } from 'mongoose';
import { logger } from '../logger';
// import { logger } from '../logger';

export class ExtendedClient extends Client {
	public commands: Collection<string, commandType> = new Collection();
	public buttons: Collection<string, buttonType> = new Collection();
	public modals: Collection<string, modalType> = new Collection();
	public menus: Collection<string, selectMenuType> = new Collection();
	public embeds = clientEmbeds;
	public cc = cc;
	public config = new Config();
	
	constructor() {
		super({
			allowedMentions: { repliedUser: false, parse: [] },
			failIfNotExists: true,
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
			],
			partials: [
				Partials.Channel,
				Partials.Reaction,
				Partials.Message
			],
			presence: {
				activities: [{
					type: ActivityType.Watching,
					name: 'your tokens'
				}]
			}
		});
		this.born();
	}
	
	private async born() {
		// Connecting to MongoDB
		if (process.env.MONGO_URL) {
			await connect(process.env.MONGO_URL, { dbName: 'alpaz' })
				.then(() => {
					logger.info('MongoDB Connected')
				})
				.catch((e) => {
				console.log(e)
				// logger.error(e.name)
			});
		}
		await this.registerModules();
		await this.config.updateAll();
		await this.login(process.env.DISCORD_TOKEN).then(() => {
			this.handlerErrors();
		});
	}

	private async importFiles(filePath: string) {
		return (await import(filePath))?.default;
	}

	// Registers commands and events if called. */
	private async registerModules() {
		// Commands
		console.log('Registering commands...');
		for (const category of readdirSync(`${__dirname}/../commands`)) {
			for (const fileName of readdirSync(`${__dirname}/../commands/${category}`)) {
				const filePath = `${__dirname}/../commands/${category}/${fileName}`;
				const command: commandType = await this.importFiles(filePath.toString());

				this.commands.set(command.interaction.name, command);
			}
		};
		console.log('Registered commands');
		
		console.log('Registering buttons...');
		for (const category of readdirSync(`${__dirname}/../buttons`)) {
			for (const fileName of readdirSync(`${__dirname}/../buttons/${category}`)) {
				const filePath = `${__dirname}/../buttons/${category}/${fileName}`;
				const button: buttonType = await this.importFiles(filePath.toString());
				
				this.buttons.set(button.customId, button)
			};
		};
		console.log('Registered buttons');

		console.log('Registering select menus...');
		for (const category of readdirSync(`${__dirname}/../selectMenus`)) {
			for (const fileName of readdirSync(`${__dirname}/../selectMenus/${category}`)) {
				const filePath = `${__dirname}/../selectMenus/${category}/${fileName}`;
				const selectMenu: selectMenuType = await this.importFiles(filePath.toString());
				
				this.menus.set(selectMenu.customId, selectMenu)
			};
		};
		console.log('Registered select menus');

		// Events
		console.log('Registering events...');
		for (const category of readdirSync(`${__dirname}/../events`)) {
			if (category.endsWith('.ts') || category.endsWith('.js')) {
				const filePath = `${__dirname}/../events/${category}`;
				const event: Event<keyof ClientEvents> = await this.importFiles(filePath.toString());
				this.on(event.event, event.run);
			} else {
				for (const fileName of readdirSync(`${__dirname}/../events/${category}`)) {
					const filePath = `${__dirname}/../events/${category}/${fileName}`;
					const event: Event<keyof ClientEvents> = await this.importFiles(filePath.toString());
					this.on(event.event, event.run);
				}
			}
		}
		console.log('Registered events');
		
		console.log('Registering modals...');
		for (const category of readdirSync(`${__dirname}/../modals`)) {
			for (const fileName of readdirSync(`${__dirname}/../modals/${category}`)) {
				const filePath = `${__dirname}/../modals/${category}/${fileName}`;
				const modal: modalType = await this.importFiles(filePath.toString());
				
				this.modals.set(modal.customId, modal);
			};
		};
		console.log('Registered modals');
	}

	// Handles process errors and exits if called.
	private handlerErrors() {
		process.on('unhandledRejection', (reason: Error) => {
			console.log('\n' + reason.stack);
		});
		process.on('uncaughtException', (reason: Error) => {
			console.log('\n' + reason.stack);
		});
		process.on('warning', (reason: Error) => {
			console.log('\n' + reason.stack);
		});
		process.on('disconnect', () => {
			this.destroy();
		});
		process.on('beforeExit', () => {
			this.destroy();
		});
		process.on('exit', () => {
			this.destroy();
		});
	};
}