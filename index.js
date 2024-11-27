require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();

// 设置环境变量
const memosHost = process.env.MEMOS_HOST || 'https://jiong.us/';
const memosLimit = process.env.MEMOS_LIMIT || '20';
const memosUserId = process.env.MEMOS_USER_ID || '110710864910866001';
const memosTittle = process.env.MEMOS_TITTLE || 'Retirement Memos';
const memosDescription = process.env.MEMOS_DESCRIPTION || '愿爱无忧! peace & love !';

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
        <title>${memosTittle}</title>
        <link rel="stylesheet" href="https://cdn.sgcd.net/lxgw-wenkai-screen-webfont/lxgwwenkaigbscreen.css" />
        <style>
            body {
                font-family: "LXGW WenKai Screen", sans-serif;
            }
        </style>
    </head>
    <body>
        <header>
            <div class="menu">
                <div class="title">首页</div>
                <div class="pages">
                    <!--   <a href="https://github.com/eallion/memos.top" target="_blank" rel="noopener noreferrer" class="">GitHub</a>
                        <a href="https://eallion.com/memos" target="_blank" rel="noopener noreferrer" class="">I'm Feeling Lucky</a>
                    -->
                </div>
            </div>
            <div class='theme-toggle'>🌓</div>
        </header>
        <section id="main" class="container">
            <h1>${memosTittle}</h1>
            <blockquote>
                <!--   <p>Je <del>memos</del>, donc je suis - <em>René Descartes fans</em></p> -->
                ${memosDescription}
            </blockquote>
            <div id="memos" class="memos">
                <!-- Memos Container -->
            </div>
        </section>
        <footer class="markdown-body footer">
            <p>Copyright @
                <script>
                    document.write(new Date().getFullYear())
                </script>
                <a href="https://www.eallion.com/" target="_blank" rel="noopener noreferrer" class="hidden">Charles
                    'eallion' Chin</a> 
                www.chaihu.top All Rights Reserved.
            </p>
        </footer>
        <!-- Your Memos API -->
        <script type="text/javascript">
            var memos = {
                host: '${memosHost}',
                limit: '${memosLimit}',
                userId: '${memosUserId}',
            }
        </script>
        <script type="text/javascript" src="assets/js/marked.umd.min.js?v=14.0.0"></script>
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

module.exports = app;