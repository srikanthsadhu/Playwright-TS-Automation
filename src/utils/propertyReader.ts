import PropertiesReader from 'properties-reader';
import * as path from 'path';

export class PropertyReader {
  private properties: PropertiesReader.Reader;

  constructor(environment: string = 'dev') {
    const configPath = path.resolve(__dirname, `../../config/${environment}.properties`);
    this.properties = PropertiesReader(configPath);
  }

  public get(key: string): string {
    return this.properties.get(key) as string;
  }

  public getBaseUrl(): string {
    return this.get('base_url');
  }

  public getApiBaseUrl(): string {
    return this.get('api_base_url');
  }

  public getBrowser(): string {
    return this.get('browser');
  }

  public isHeadless(): boolean {
    return this.get('headless') === 'true';
  }

  public getTimeout(): number {
    return parseInt(this.get('timeout'), 10);
  }
}
