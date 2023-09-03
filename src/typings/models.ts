import { Snowflake } from "discord.js"

export type bountyType = {
    name: string,
    description: string,
    tags: string[],
    startDate: number,
    endDate: number,
}

export type GuildModelType = {
    channels: Array<Snowflake>;
    guildID: Snowflake;
    store: Snowflake | undefined,
    bounty: {
        channel: Snowflake | undefined,
        messageID: Snowflake | undefined,
        lastRefreshed: number
    }
    welcome: {
        dmMode: boolean;
        nibs: number;
        active: boolean
    };
    prompt: string;
}

export type BountyStatus = {
    userId: Snowflake
    status?: 'pending' | 'approved' | 'rejected'    
}

export type UserModelType = {
    userID: Snowflake;
    balance: number;
    generalCooldown: number;
    cooldown: boolean;
    completedBounties: number;
    countLastUpdated: number;
    receivedRoleAt: number;
    lastCheckIn: number;
}

export type ItemModalType = {
    title: string;
    description: string;
    cost: number;
    active: boolean;
    guildID: Snowflake;
}

export interface BountyModalType {
    guildID: Snowflake;
    title: string;
    description: string;
    cost: Number
    basicInfo: string;
    purchasedBy?: Array<Snowflake>;
    completedBy?: Array<BountyStatus>;
    startDate: number;
    endDate: number;
}