const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    //配置发送者的邮箱服务器和登录信息
    host: 'smtp.qq.com',//163、qq等
    port: 465,
    auth: {
        user: '1912504939@qq.com',//邮箱
        pass: 'dnskztuatjtidbbc'//邮箱密码或授权码
    }
});

var mailOptions = {
    from: '灯若银河 <1912504939@qq.com>',//'"邮件显示名" 
    to: '1912504939@qq.com',//接受者 //
    subject: 'Hello world!',//主题名
    text: 'Hello world!',//文本
    html: `<h2>nodemailer基本使用</h2>`,//内容
}

transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("发送成功");
})
