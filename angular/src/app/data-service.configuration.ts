import {Injectable} from '@angular/core';

@Injectable()
export class Configuration {
    public server = 'http://dummy.restapiexample.com/';
    public apiUrl = 'api/v1/employees';
    public serverWithApiUrl = this.server + this.apiUrl;
}
