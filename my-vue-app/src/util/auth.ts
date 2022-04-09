import VueCookies from 'vue-cookies'

const TokenKey: string = 'Token'

export function getToken() {
    return VueCookies.get(TokenKey) || { token: '', id: '', roleId: '' };
}

export function setToken(token: string, id: number, roleId: number, name: string) {
    return VueCookies.set(TokenKey, { token: token, id: id, roleId: roleId, name }, '28800s');
}

export function removeToken() {
    return VueCookies.remove(TokenKey);
}