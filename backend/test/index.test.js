const axios = require('axios')
const { faker } = require('@faker-js/faker')
const URL = `http://localhost:6006`
const authorization = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NzMzMTgwODE5NTQsIlVzZXJJRCI6MX0.L39r1_b9Gfupai7iJiPqRo1yArostGokHhj_znOu59s`
const config = () => ({ headers: { 'Authorization': authorization, 'Content-Type': 'application/json' } });

test.only("获取验证码", async () => {
    const data = { email: `${faker.internet.email()}` }
    const result = await axios.post(`${URL}/library/_sms_login`, data, config())
    expect(result.data).toEqual(true)
})

test("获取验证码:不传邮箱", async () => {
    const data = {}
    const result = await axios.post(`${URL}/library/_sms_login`, data, config()).catch(err => err)
    console.log(result);
    expect(result.response.status).toEqual(412)
})

test("获取验证码:邮箱格式不正确", async () => {
    const data = { email: `${faker.random.numeric(9)}@` }
    const result = await axios.post(`${URL}/library/_sms_login`, data, config()).catch(err => err)
    expect(result.response.status).toEqual(412)
})

test("获取验证码:传number类型的邮箱", async () => {
    const data = { email: faker.random.numeric(9) }
    const result = await axios.post(`${URL}/library/_sms_login`, data, config()).catch(err => err)
    expect(result.response.status).toEqual(412)
})
