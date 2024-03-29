import { ThreadChannel } from "discord.js";
import { getGuild } from "../../schemas/guild";
import { Event } from "../../structures/Event";
import { getBalance, setCooldown, updateBalance } from "../../schemas/user";
import { RoleIDs } from "../../typings";

export default new Event('messageCreate', async (message) => {
    if (!message.guild.available || !message.guild || message.author.bot || !message.content) return;
    
    const guild = await getGuild(message.guild.id)
    const channel = (message.channel instanceof ThreadChannel) ? message.channel : message.channel;
    if (!guild.channels.includes(channel.id)) {
        let base = 10;
        const member = await getBalance(message.author.id);
        if (member.generalCooldown > Math.floor(Date.now()) / 1000)    return;

        const memberRoles = message.member?.roles.cache!
        if (memberRoles.has(RoleIDs.supereggie)){ //Super Eggie
            base = base * 2.5;
        } else if (memberRoles.has(RoleIDs.serverBooster)) { //server booster
            base = base * 1.8;
        } else if (memberRoles.has(RoleIDs.professional)) { //professional
            base = base * 1.6
        } else if (memberRoles.has(RoleIDs.expert)) { //expert
            base = base * 1.4;
        } else if (memberRoles.has(RoleIDs.advanced)) { //advanced
            base = base * 1.2;
        } else if (memberRoles.has(RoleIDs.adept)) {
            base = base * 1.1;
        }
        if (message.attachments.size > 0) {
            base = base + base * .5
        };
    
        member.balance = member.balance + base;
        member.generalCooldown = Math.floor((Date.now() / 1000) + 300);
        await member.save();
    }
    if (!(channel.id && guild.channels.includes(channel.id) && message.attachments.size > 0)) return;

    const member = await getBalance(message.author.id);
    if (member.cooldown) return;
    
    const memberRoles = message.member?.roles.cache!
    let rand = (Math.floor(Math.random() * 4) + 2); rand = rand + rand;

    if (memberRoles.has(RoleIDs.supereggie)){ //Super Eggie
        rand = rand * 4;
    } else if (memberRoles.has(RoleIDs.serverBooster)) { //server booster
        rand = rand * 1.8;
    } else if (memberRoles.has(RoleIDs.professional)) { //professional
        rand = rand * 1.6
    } else if (memberRoles.has(RoleIDs.expert)) { //expert
        rand = rand * 1.4;
    } else if (memberRoles.has(RoleIDs.advanced)) { //advanced
        rand = rand * 1.2;
    } else if (memberRoles.has(RoleIDs.adept)) {
        rand = rand * 1.1;
    }

    await updateBalance(message.author.id, member.balance + rand);
    await setCooldown(message.author.id, true)
        .then(async () => {
            setTimeout(async () => {
                await setCooldown(message.author.id, false);
            })
        })
})