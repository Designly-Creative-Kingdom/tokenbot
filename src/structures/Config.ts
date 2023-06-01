import { Snowflake, WebhookClient } from 'discord.js';

export class Config {
	/** Logging system status */
	public logging = {
		webhook: null as WebhookClient,
		joinsLogging: null as Snowflake,
		submissions: null as Snowflake
	};

	/** General data */
	public general = {
		developers: [] as string[],
		guildID: null as Snowflake,
	};

	public async updateAll() {
		this.general = {
			developers: [],
			guildID: '1059213169551233145'
		}
		this.logging = {
			webhook: new WebhookClient({ url: 'https://canary.discord.com/api/webhooks/1104173272196726955/X1ZJOVPeczMAnPXiPHsvXMDiHl22o53NI6FOoLXz1hpGPHlfayrs9DrSqQoXdbFNnI3y' }),
			joinsLogging: '1104173249115476038',
			submissions: '1108487776523005953'
		};
	};
};