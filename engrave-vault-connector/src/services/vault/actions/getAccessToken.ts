import store from '../store/store';
import sc from '../../../submodules/engrave-shared/services/steemconnect/steemconnect.service';
import getRefreshToken from './getRefreshToken';
import storeAccessToken from './storeAccessToken';

export default async (username: string, elevated: boolean) => {

    if( ! elevated) {
        const { data: {value: token}} = await store.read(`secret/access/blog/${username}`)    
        return token;
    } else {
        try {
            const { data: {value: access_token}} = await store.read(`secret/access/dashboard/${username}`);
            return access_token;
            
        } catch (error) {
            try {
                const refresh_token = await getRefreshToken(username);    
                const {data: { access_token }} = await sc.fetchElevatedAccessToken(refresh_token);
                await storeAccessToken(username, access_token, true);
                return access_token;
            } catch (error) {
                return null;
            }
        }
    }

}