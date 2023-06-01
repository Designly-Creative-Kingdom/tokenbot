import { checkBounties } from "./jobs/checkBounties";
import { logger } from "./logger";

export async function registerWorkers(timeout: number) {
    logger.info('Registered workers', { showDate: false });

    setInterval(async () => {   
        await checkBounties()
    }, timeout)
}