import { Snowflake, WebhookClient } from 'discord.js';

export class Config {
	/** Logging system status */
	public logging = {
		loggingThread: null as Snowflake,
		webhook: null as WebhookClient,
		submissions: null as Snowflake,
		purchases: null as Snowflake,
		checkInResponses: null as Snowflake,
	};

	/** General data */
	public general = {
		developers: [] as string[],
		guildID: null as Snowflake,
		mainChannel: null as Snowflake,
		bountyHunter: null as Snowflake
	};

	public async updateAll() {
		this.general = {
			developers: [],
			guildID: '887221697370021888',
			mainChannel: '996859553968832624',
			bountyHunter: '1092625342348402729'
		}
		this.logging = {
			loggingThread: '1119393431257612308',
			webhook: new WebhookClient({ url: 'https://canary.discord.com/api/webhooks/1119762514587173005/jSn6a2m3muWyubm8e5FSjL2yt7-EFlrpEGqGlnpVYqEiq74pOSjLEstcdHAwcQuv6ICR' }),
			submissions: '1119393363016302593',
			purchases: '1119762423935664178',
			checkInResponses: '1123349556596318378'
		}
	};
};
