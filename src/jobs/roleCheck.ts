import { client } from "..";
import { checkIfFourBounties, userModel } from "../schemas/user";

export async function roleCheck() {
    const guild = client.guilds.cache.get(client.config.general.guildID);
    const users = await userModel.find({ completedBounties: { gt: 3 } });
    const userIDs = [];
    users.forEach(async (u) => {
        const check = await checkIfFourBounties(u.userID);
        if (check) {
            userIDs.push(u.userID);
        };
    })
    userIDs.forEach(async (u) => {
        setTimeout(async () => {
            const user = await guild.members.fetch(u);
            if (user.roles.cache.has(client.config.general.bountyHunter)) return;
        }, 2000) 
    })
}

// check if bounty count is equal to 4