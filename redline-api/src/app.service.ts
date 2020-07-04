import { Injectable, HttpService } from '@nestjs/common';
import { constantsConfig as config } from './config/constants.config';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  async fetchLocation(address: String) {
    const res = await this.httpService
      .get(
        `https://api.opencagedata.com/geocode/v1/json?key=${config.opencage.api_key}&q=${address}&limit=1&countrycode=be`,
      )
      .toPromise();
    const result = res.data.results[0];
    return {
      address: result.formatted,
      coords: result.geometry,
    };
  }
}
