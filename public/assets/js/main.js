// 初始化配置
const memo = {
    host: 'https://demo.usememos.com/',
    limit: '10',
    userId: '101',
    domId: '#memos',
};
if (typeof memos !== "undefined") {
    for (let key in memos) {
        if (memos[key]) {
            memo[key] = memos[key];
        }
    }
}
const limit = memo.limit;
const memosHost = memo.host.replace(/\/$/, '');
const memoUrl = `${memosHost}/api/v1/accounts/${memo.userId}/statuses?limit=${limit}&exclude_replies=true&only_public=true`;

// 选择 DOM 元素
const memoDom = document.querySelector(memo.domId);
if (!memoDom) {
    console.error(`Element with ID '${memo.domId}' not found.`);
}

// 插入 HTML
function updateHTMl(data) {
    console.log('Data received:', data); // 调试信息
    let memoResult = "", resultAll = "";
    // 解析 TAG 标签，添加样式
    const TAG_REG = /#([^\s#]+?) /g;
    // 解析 Bilibili
    const BILIBILI_REG = /<a\shref="https:\/\/www\.bilibili\.com\/video\/((av[\d]{1,10})|(BV([\w]{10})))\/?">.*<\/a>/g;
    // 解析网易云音乐
    const NETEASE_MUSIC_REG = /<a\shref="https:\/\/music\.163\.com\/.*id=([0-9]+)".*?>.*<\/a>/g;
    // 解析 QQ 音乐
    const QQMUSIC_REG = /<a\shref="https\:\/\/y\.qq\.com\/.*(\/[0-9a-zA-Z]+)(\.html)?".*?>.*?<\/a>/g;
    // 解析腾讯视频
    const QQVIDEO_REG = /<a\shref="https:\/\/v\.qq\.com\/.*\/([a-z|A-Z|0-9]+)\.html".*?>.*<\/a>/g;
    // 解析 Spotify
    const SPOTIFY_REG = /<a\shref="https:\/\/open\.spotify\.com\/(track|album)\/([\s\S]+)".*?>.*<\/a>/g;
    // 解析优酷视频
    const YOUKU_REG = /<a\shref="https:\/\/v\.youku\.com\/.*\/id_([a-z|A-Z|0-9|==]+)\.html".*?>.*<\/a>/g;
    // 解析 YouTube
    const YOUTUBE_REG = /<a\shref="https:\/\/www\.youtube\.com\/watch\?v\=([a-z|A-Z|0-9]{11})\".*?>.*<\/a>/g;

    data.forEach((item, i) => {
        console.log('Processing item:', item); // 调试信息
        let memoContREG = item.content
            .replace(TAG_REG, "<span class='tag-span'><a rel='noopener noreferrer' href='#$1'>#$1</a></span>");
        memoContREG = marked.parse(memoContREG)
            .replace(BILIBILI_REG, "<div class='video-wrapper'><iframe src='//www.bilibili.com/blackboard/html5mobileplayer.html?bvid=$1&as_wide=1&high_quality=1&danmaku=0' scrolling='no' border='0' frameborder='no' framespacing='0' allowfullscreen='true' style='position:absolute;height:100%;width:100%;'></iframe></div>")
            .replace(YOUTUBE_REG, "<div class='video-wrapper'><iframe src='https://www.youtube.com/embed/$1' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='YouTube Video'></iframe></div>")
            .replace(NETEASE_MUSIC_REG, "<meting-js auto='https://music.163.com/#/song?id=$1'></meting-js>")
            .replace(QQMUSIC_REG, "<meting-js auto='https://y.qq.com/n/yqq/song$1.html'></meting-js>")
            .replace(QQVIDEO_REG, "<div class='video-wrapper'><iframe src='//v.qq.com/iframe/player.html?vid=$1' allowFullScreen='true' frameborder='no'></iframe></div>")
            .replace(SPOTIFY_REG, "<div class='spotify-wrapper'><iframe style='border-radius:12px' src='https://open.spotify.com/embed/$1/$2?utm_source=generator&theme=0' width='100%' frameBorder='0' allowfullscreen='' allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture' loading='lazy'></iframe></div>")
            .replace(YOUKU_REG, "<div class='video-wrapper'><iframe src='https://player.youku.com/embed/$1' frameborder=0 'allowfullscreen'></iframe></div>")
            .replace(YOUTUBE_REG, "<div class='video-wrapper'><iframe src='https://www.youtube.com/embed/$1' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='YouTube Video'></iframe></div>");

        // 解析内置资源文件
        if (item.media_attachments && item.media_attachments.length > 0) {
            let imgUrl = '';
            item.media_attachments.forEach(attachment => {
                if (attachment.type === 'image') {
                    imgUrl += `<div class="resimg"><img loading="lazy" src="${attachment.preview_url}"/></div>`;
                }
            });
            if (imgUrl) {
                memoContREG += `<div class="resource-wrapper"><div class="images-wrapper">${imgUrl}</div></div>`;
            }
        }

        const relativeTime = getRelativeTime(new Date(item.created_at));
        memoResult += ` 
        <li class="timeline" id="${item.id}">
        <div class="memos__content" style="--avatar-url: url('${item.account.avatar}')"> 
            <div class="memos__text">
                <div class="memos__userinfo"><div> 
            ${item.account.display_name} 
            </div>
            <div>
                <svg viewBox="0 0 24 24" aria-label="认证账号" class="memos__verify">
                <g>
                   <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z">
                   </path>
                </g>
                </svg>
            </div>
            <div>
                <div class="memos__id">@<a href=${item.account.url} target=_blank>${item.account.acct}</a></div>
            </div>
        </div>
        <p>${memoContREG}</p>
        <div class="memos__meta">
        <small class="memos__date">${relativeTime} • From「<a href="${item.url}" target="_blank">${item.application.name}</a>」</small>
        </div> 
        </li>`;
    });

    const memoBefore = '<ul class="">';
    const memoAfter = '</ul>';
    resultAll = memoBefore + memoResult + memoAfter;
    memoDom.insertAdjacentHTML('beforeend', resultAll);

    // 初始化图片灯箱
    window.ViewImage && ViewImage.init('.container img');
}

// 相对时间计算
function getRelativeTime(date) {
    const rtf = new Intl.RelativeTimeFormat(memos.language, { numeric: "auto", style: 'short' });
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return rtf.format(-years, 'year');
    } else if (months > 0) {
        return rtf.format(-months, 'month');
    } else if (days > 0) {
        return rtf.format(-days, 'day');
    } else if (hours > 0) {
        return rtf.format(-hours, 'hour');
    } else if (minutes > 0) {
        return rtf.format(-minutes, 'minute');
    } else {
        return rtf.format(-seconds, 'second');
    }
}

// 获取数据并更新页面
async function fetchDataAndUpdate() {
    try {
        const response = await fetch(memoUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // 过滤掉转嘟和回复的状态
        const filteredData = data.filter(toot => {
            return !toot.reblog && !toot.in_reply_to_id;
        });

        updateHTMl(filteredData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchDataAndUpdate();
