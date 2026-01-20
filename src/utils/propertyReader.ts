import PropertiesReader from 'properties-reader';
import * as path from 'path';

export class PropertyReader {
  private properties: PropertiesReader.Reader;

  constructor(environment: string = 'dev') {
    const configPath = path.resolve(__dirname, `../../config/${environment}.properties`);
    this.properties = PropertiesReader(configPath);
  }

  public get(key: string): string {
    const value = this.properties.get(key);
    if (value === null || value === undefined) {
      throw new Error(`Property '${key}' not found in configuration`);
    }
    return value as string;
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
    const timeout = parseInt(this.get('timeout'), 10);
    if (isNaN(timeout)) {
      throw new Error(`Invalid timeout value in configuration`);
    }
    return timeout;
  }
}
