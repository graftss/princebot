import Discord from 'discord.js';

export interface ReactionRole {
  guildID: string;
  channelID: string;
  messageID: string;
  emojiName: string;
  roleID: string;
}

const testReactionRole: ReactionRole = {
  guildID: '572531842952200223',
  channelID: '572531842952200226',
  messageID: '832161440864665640',
  emojiName: '😇',
  roleID: '832167679271108620',
};

export const addReactionRoles = (client: Discord.Client): void => {
  // TODO: make this an argument
  const reactionRole = testReactionRole;

  const channel: Discord.TextChannel = client.channels.resolve(
    reactionRole.channelID,
  ) as Discord.TextChannel;
  const role = channel.guild.roles.resolve(reactionRole.roleID);

  if (role === null) {
    console.log('addReactionRoles error: role not found.', reactionRole);
    return;
  }

  channel.messages.fetch(reactionRole.messageID).then(message => {
    // give up if the watched message doesn't exist
    if (message === null) {
      console.log('addReactionRoles error: message not found.', reactionRole);
      return;
    }

    message.react('😇');
    const reactionCollector = new Discord.ReactionCollector(
      message,
      reaction => true || reaction.emoji.name === reactionRole.emojiName,
      { dispose: true } as any,
    );
    reactionCollector.on(
      'collect',
      (reaction: Discord.MessageReaction, user) => {},
    );
    reactionCollector.on('remove', (reaction, user) => {});
  });
};
