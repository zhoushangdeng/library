const axios = require('axios')
const { faker } = require('@faker-js/faker')
const URL = `http://localhost:6006`
const authorization = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NzUwNDc3Mjg2MTMsIlVzZXJJRCI6MX0.HXKKpQHYiZGbVgq7BijzlW4alFKttDYa-JFfGmE3z_g`
const config = () => ({ headers: { 'Authorization': authorization, 'Content-Type': 'application/json' } });

test.only("查询菜单", async () => {
    const roleId = '2001'
    const result = await axios.get(`${URL}/library/menu/tree?roleId=${roleId}`, {}, config())
    expect(result.data).toEqual(true)
})