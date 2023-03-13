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
			developers: [''],
			appealLink: '',
		}
		this.logging = {
			webhook: new WebhookClient({ url: '' }),
			reports: { channelId: '', active: true }
		};
	};
};
