import { Command } from '../types';

const socials = [
  '!socials',
  '!social',
  '!socialmedia',
  '!socialmediaaccountlinksforrandomizerhater92akagrass',
];

export const handleSocials: Command = (client, { channel, text }) => {
  const socialIdx = socials.indexOf(text);

  if (socialIdx === socials.length - 1) {
    client.say(channel, 'My only social media account is this twitch channel.');
  } else if (socialIdx >= 0) {
    const next = socials[socialIdx + 1];
    client.say(
      channel,
      `Sorry, ${text} is deprecated. Please use ${next} instead.`,
    );
  }
};
