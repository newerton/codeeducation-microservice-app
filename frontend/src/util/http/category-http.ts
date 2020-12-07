import HttpResource from './http-resource';
import { httpVideo } from '.';

const categoryHttp = new HttpResource(httpVideo, 'categories');

export default categoryHttp;
