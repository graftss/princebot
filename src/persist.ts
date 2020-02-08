import path from 'path';
import fs from 'fs';

const statePath = path.join(__dirname, '../state.json');

export const persist = {
  load: () => JSON.parse(fs.readFileSync(statePath).toString()),

  save: state => fs.writeFileSync(statePath, JSON.stringify(state)),
};
