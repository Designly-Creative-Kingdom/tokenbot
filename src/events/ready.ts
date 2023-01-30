import { Event } from '../structures/Event';
import { registerWorkers } from '../workers';

export default new Event('ready', async (client) => {
	console.log(`Logged in as ${client.user.tag}`);
	await registerWorkers(60 * 1000);
});
