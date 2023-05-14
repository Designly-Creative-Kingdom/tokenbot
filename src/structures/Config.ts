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

	};

	public async updateAll() {
		this.general = {
			developers: [''],
			appealLink: '',
<<<<<<< HEAD

=======
>>>>>>> 5f8a59bc5960ff8c5f8eb21cf5f39440c14a0031
		}
		this.logging = {
			webhook: new WebhookClient({ url: '' }),
			reports: { channelId: '', active: true }
		};
	};
};
