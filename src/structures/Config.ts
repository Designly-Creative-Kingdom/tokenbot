import { WebhookClient } from 'discord.js';

export class Config {
	/** Logging system status */
	public logging = {
		webhook: null as WebhookClient,
		reports: { channelId: null as string, active: null },
	};

	/** General data */
	public general = {
		developers: [] as string[],
		appealLink: null as string,
		jobPostingChannel: null as string,
		priorityPostChannel: null as string,
	};

	public async updateAll() {
		this.general = {
			developers: [],
			appealLink: '',
			jobPostingChannel: '1064269297075105944',
			priorityPostChannel: '1064267202951393370'
		}
		this.logging = {
			webhook: new WebhookClient({ url: 'https://discord.com/api/webhooks/1059219126284980244/MXr0i2rY5MpQdNmQttabpk2TKVcx6bITJ_b8mpw-fLzUSSkmh4ecaHdfEa67o1jBRCs5' }),
			reports: { channelId: '1059219108954120213', active: true }
		};
	};
};