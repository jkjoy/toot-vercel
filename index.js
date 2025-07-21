require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');

// 设置环境变量
const Host = process.env.HOST || 'https://jiong.us/';
const UserId = process.env.USERID || '110710864910866001';
const Tittle = process.env.TITTLE || 'Retirement Memos';
const Description = process.env.DESCRIPTION || '愿爱无忧! peace & love !';

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 动态生成 HTML
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="referrer" content="no-referrer">
        <link rel="icon" href="/assets/img/logo.webp" type="image/*" />
        <link href="assets/css/style.css" rel="stylesheet" type="text/css">
        <link href="assets/css/APlayer.min.css" rel="stylesheet" type="text/css">
        <link href="assets/css/highlight.github.min.css" rel="stylesheet" type="text/css">
        <link href="assets/css/custom.css" rel="stylesheet" type="text/css">
        <title>${Tittle}</title>              
        <link rel="stylesheet" href="https://cdn.0tz.top/lxgw-wenkai-screen-webfont/style.css" /> 
        <style>body{font-family:"LXGW WenKai Screen",sans-serif;}</style>
    </head>
    <body>
        <header>
            <div class="menu">
                <div class="title">首页</div>
                <div class="pages">
                </div>
            </div>
            <div class='theme-toggle'>🌓</div>
        </header>
        <section id="main" class="container">
            <h1>${Tittle}</h1>
            <blockquote>
                <!--   <p>Je <del>memos</del>, donc je suis - <em>René Descartes fans</em></p> -->
                ${Description}
            </blockquote>
            <div id="memos" class="memos">
                <!-- Memos Container -->
            </div>
        </section><button id="backToTopBtn" title="Go to top">Top</button>
        <footer class="markdown-body footer">
            <p>Copyright @
                <script>
                    document.write(new Date().getFullYear())
                </script>
                 ${Tittle}  All Rights Reserved.
            </p>
        </footer>
        <script type="text/javascript" src="assets/js/view-image.min.js"></script>
        <script type="text/javascript" src="assets/js/APlayer.min.js"></script>
        <script type="text/javascript" src="assets/js/Meting.min.js"></script>
        <script type="text/javascript" src="assets/js/main.js"></script>
        <script type="text/javascript" src="assets/js/custom.js"></script>
    </body>
    </html>
    `;

    res.send(html);
});

// 代理 /api/memos 路由
app.get('/api/memos', async (req, res) => {
    const url = `${Host}/api/v1/accounts/${UserId}/statuses?limit=10&exclude_replies=true&only_public=true`;
    const token = process.env.TOKEN; // 可选
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(url, {
            headers,
            timeout: 5000 // 5秒超时
        });
        res.json(response.data);
    } catch (err) {
        if (err.code === 'ECONNABORTED') {
            res.status(504).json({ error: '请求第三方API超时' });
        } else {
            res.status(500).json({ error: 'API 代理失败', detail: err.message });
        }
    }
});

module.exports = app;
