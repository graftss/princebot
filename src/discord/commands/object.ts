import Discord from 'discord.js';
import { Command } from '../Command';
import {
  matchObjectCommand,
  handleObjectCommand,
  ObjectCommandResult,
  filterToString,
  pickupSizeToString,
} from '../../lib/reroll-objects';
import { stringDb } from '../../lib/reroll-strings';

const empty = '\u200b';

// :)
const maybeMap = (value: any, f: any = x => x): any =>
  value === undefined ? '???' : f(value);

const objectEmbed = (objResult: ObjectCommandResult): Discord.RichEmbed => {
  const { filter, primaryLanguage: lang, object, searchIgnored } = objResult;

  const getString = (id): Maybe<string> => stringDb.getString(id, lang);

  const objName = maybeMap(object.nameStrId, getString);

  let nameLabel = '';
  if (!object.isCollectible) {
    const localSecret = stringDb.getString('OT_OBJ_1459', lang);
    nameLabel = `   (${localSecret})`;
  } else if (object.isRare) {
    const localRare = stringDb.getString('UI_NIC_037', lang);
    nameLabel = `   (${localRare})`;
  }

  const title = objName + nameLabel;

  const sizeToRollUp = [
    stringDb.getString('UI_NIC_036', lang),
    maybeMap(object.pickupSize, pickupSizeToString),
  ].join('  ');

  const info =
    [object.categoryStrId, object.locationStrId, object.sizeStrId]
      .filter(v => v !== undefined)
      .map(getString)
      .join(' / ') || empty;

  console.log(object);

  const result = new Discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle(title)
    .addField(sizeToRollUp, info);

  const objDesc = getString(object.descriptionStrId);
  if (objDesc !== undefined) {
    result.addField('- '.repeat(35), objDesc);
  }

  if (filter !== undefined) {
    result.setFooter(`Searched "${filterToString(filter, lang)}"`);
  } else if (searchIgnored) {
    result.setFooter(`Search ignored`);
  }

  return result;
};

export const command: Command = {
  match(message: Discord.Message): boolean {
    return matchObjectCommand(message.content);
  },

  handle(message: Discord.Message) {
    const response = handleObjectCommand(message.content);
    if (response !== undefined) {
      return message.channel.send(objectEmbed(response));
    }
  },
};
