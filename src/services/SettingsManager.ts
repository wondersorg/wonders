import { injectable, singleton } from 'tsyringe';
import fs from 'fs';
import lodash from 'lodash';
import { app } from 'electron';
import path from 'path';

@injectable()
@singleton()
export class SettingsManager {
  private settingsPath: string;
  private currentSettings: Map<string, object>;

  constructor() {
    this.settingsPath = path.resolve(app.getAppPath(), "./settings");
    this.currentSettings = new Map();
  }

  public async start() {
    if (!fs.existsSync(this.settingsPath)) {
      fs.mkdirSync(this.settingsPath);
    }

    fs.readdir(this.settingsPath, (err, files) => {
      if (err)
        throw new Error(err.message);

      files.forEach(async (file) => {
        if (file === '.exists' || !file.endsWith('.json'))
          return;
        let { default: fileContent }: any = await import(`../settings/${file}`);
        this.currentSettings.set(file.split('.')[0], fileContent);
      });
    });
  }

  get cache() {
    return this.currentSettings;
  }

  public initSettings(name: string, settings: any) {
    if (fs.existsSync(path.resolve(this.settingsPath, `${name}.json`))) {
      console.log('File already exists');
    } else {
      fs.writeFile(
        path.resolve(this.settingsPath, `${name}.json`),
        JSON.stringify(settings),
        (e: any) => {
          if (e) console.log('An error occured creating settings', e);
        }
      );
    }
  }

  public fetchSettings(name: string) {
    if (!this.currentSettings.has(name))
      return console.log('No setting exists');

    return this.currentSettings.get(name);
  }

  public updateSetting(name: string, settings: any) {
    if (!this.currentSettings.has(name))
      return console.log(`Setting ${name} does not exist`);

    var obj = this.currentSettings.get(name);
    var newObj = lodash.merge(obj, settings);
    this.currentSettings.set(name, newObj);
    fs.writeFile(
      path.resolve(this.settingsPath, `${name}.json`),
      JSON.stringify(newObj),
      (e: any) => {
        if (e) console.error(e);
      }
    );
  }
}
