import { createDiscordBot } from './createDiscordBot';

createDiscordBot()
    .then(e => console.log(`discord success: ${e}`))
    .catch(e => console.log(`discord failure: ${e}`));
