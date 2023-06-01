import { ThreadChannel } from "discord.js";
import { getGuild } from "../../schemas/guild";
import { Event } from "../../structures/Event";
import { getBalance, setCooldown, updateBalance } from "../../schemas/user";
import { RoleIDs } from "../../typings";

export default new Event('messageCreate', async (message) => {
    if (!message.guild.available || !message.guild || message.author.bot || !message.content) return;
    
    const guild = await getGuild(message.guild.id)
    const channel = (message.channel instanceof ThreadChannel) ? message.channel : message.channel;
    if (!(channel.id && guild.channels.includes(channel.id) && message.attachments.size > 0)) return;

    const member = await getBalance(message.author.id, message.guild.id);
    if (member.cooldown) return;
    
    const memberRoles = message.member?.roles.cache!
    let rand = (Math.floor(Math.random() * 4) + 2); rand = rand * 25 + rand;

    if(memberRoles.has(RoleIDs.comet)){ //lord +
        rand = rand * 3;
    } else if (memberRoles.has(RoleIDs.supporter)) { //lord silver
        rand = rand * 2;
    } else if (memberRoles.has(RoleIDs.serverBooster)) { //server booster
        rand = rand * 1.8;
    } else if (memberRoles.has(RoleIDs.professional)) { //professional
        rand = rand * 1.6
    } else if (memberRoles.has(RoleIDs.expert)) { //expert
        rand = rand * 1.4;
    } else if (memberRoles.has(RoleIDs.advanced)) { //advanced
        rand = rand * 1.2;
    } else if (memberRoles.has(RoleIDs.skilled)) { //skilled
        rand = rand * 1.1;
    }

    await updateBalance(message.author.id, message.guild.id, member.balance + rand);
    await setCooldown(message.author.id, message.guild.id, true)
        .then(async () => {
            setTimeout(async () => {
                await setCooldown(message.author.id, message.guild.id, false);
            })
        })
})