import HttpResource from './http-resource';
import { httpVideo } from '.';

const castMemberHttp = new HttpResource(httpVideo, 'cast_members');

export default castMemberHttp;
