---
title: Nodejs 爬取one和墨迹天气定时发邮件
categories: 全栈
tag:
  - js
  - node.js
abbrlink: 713d3487
date: 2019-04-10 15:45:01
cover: https://cdn.nlark.com/yuque/0/2019/jpeg/172796/1559115407732-assets/web-upload/91f1f1c7-6b88-4f21-9b42-02804ae26daf.jpeg
top: 99
---

> 根据用户配置 爬取 one 和不同地区墨迹天气 每天定时发邮件，支持多人地区个性化定制 可以的话 可以去`https://github.com/cyea/email-bot` 给个小星星

## 效果展示

![](https://i.loli.net/2019/04/09/5cac0c1ca75f1.png)
![](https://i.loli.net/2019/04/10/5cadac38610bd.jpg)

## 如何快速使用

### 1. 拉取代码安装依赖

**这里使用`yarn`作为包管理器**

```bash
git clone https://github.com/cyea/email-bot.git
cd email-bot
yarn
```

### 2. 配置

#### ① 修改发送者邮箱账号密码敏感配置

新建`.env`文件 格式是跟`.env.example` 一样的 **填入自己的邮箱账号密码及邮件提供商**

```bash
NODE_ENV = production #正式环境精简代码所用
EmianService = outlook #邮件提供商 支持列表：https://nodemailer.com/smtp/well-known/
EamilAuth_user = xxxx@outlook.com #发送者邮箱地址
EamilAuth_pass = xxxxxxxxx # smtp 授权码
```

#### ② 修改其他不敏感配置

修改`config/index.js`里的配置文件

```js
const { env } = process;
module.exports = {
  ONE: "http://wufazhuce.com/", // ONE的web版网站
  MOJI_HOST: "https://tianqi.moji.com/weather/china/", // 中国墨迹天气url,
  EmianService: env.EmianService, // 发送者邮箱厂家
  EamilAuth: {
    // 发送者邮箱账户用户名及密码
    user: env.EamilAuth_user,
    pass: env.EamilAuth_pass
  },
  EmailFrom: "yuyehack@outlook.com", // 发送者昵称与邮箱地址
  EmailSubject: "一封暖暖的小邮件", // 邮件主题
  /**
   * @description: 收信人详细
   */
  EmailToArr: [
    {
      TO: "yuyehack@gmail.com", // 接收者邮箱地址
      CITY: "jiangsu", // 墨迹天气链接末尾城市代码
      LOCATION: "pukou-district" // 墨迹天气链接末尾详细地区代码
    },
    {
      TO: "yuyehack@qq.com",
      CITY: "jiangsu",
      LOCATION: "kunshan"
    }
  ],
  //每日发送时间
  SENDDATE: "58 15 8 * * *"
};
```

#### ③ 运行

```bash
yarn start
```

## 代码详解

> 具体代码可见 https://github.com/cyea/email-bot.git

先展示下项目结构

```
├─config
│      index.js #配置
│
├─email
│      index.js #发送邮件模块
│
├─superagent
│      index.js #获取天气及ONE 数据
│
├─utils
│      index.js #通用工具函数
│      superagent.js #请求发送封装
│
├─view
|        index.js #生成邮件样式模块
|        index.njk #邮件样式模板模块
│  .env.example #.env
│  index.js #服务启动模块
│  schedule.js #定时模块
│  test.js #模板样式调试模块
│  yarn.lock
│  .gitignore
│  LICENSE
│  package.json
│  README.md
```

### 1. 爬取数据

使用 superagent 和 cheerio 组合来实现爬虫

#### ① superagent 使用

因为多次两次使用的`superagent` 函数代码结构类似 所以我再把 `superagent` 封装了一次 `Promise` 抛出 `fetch`方法

```js
// utils/superagent.js
const superagent = require("superagent");
//请求
function fetch(url, method, params, data, cookies) {
  return new Promise(function(resolve, reject) {
    superagent(method, url)
      .query(params)
      .send(data)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .end(function(err, response) {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
  });
}
module.exports = fetch;
```

#### ② 数据爬取

- 爬取 ONE

```js
const getOne = async () => {
  // 获取每日一句
  let res = await fetch(config.ONE, "GET");
  let $ = cheerio.load(res.text); //转化成类似jquery结构
  let todayOneList = $("#carousel-one .carousel-inner .item");
  // 通过查看DOM获取今日句子
  let info = $(todayOneList[0])
    .find(".fp-one-cita")
    .text()
    .replace(/(^\s*)|(\s*$)/g, "");
  let imgSrc = $(todayOneList[0])
    .find(".fp-one-imagen")
    .attr("src");

  return {
    // 抛出 one 对象
    one: {
      info,
      imgSrc
    }
  };
};
```

- 爬取天气

```js
const getWeather = async (city, location) => {
  //获取墨迹天气
  let url = config.MOJI_HOST + city + "/" + location; // 根据配置得到天气url
  let res = await fetch(url, "GET");
  let $ = cheerio.load(res.text);

  //获取墨迹天气地址
  let addressText = $(".search_default")
    .text()
    .trim()
    .split("， ")
    .reverse()
    .join("-");

  //获取墨迹天气提示
  let weatherTip = $(".wea_tips em").text();

  //  获取现在的天气数据
  const now = $(".wea_weather.clearfix");

  let nowInfo = {
    Temp: now.find("em").text(),
    WeatherText: now.find("b").text(),
    FreshText: now.find(".info_uptime").text()
  };

  // 循环获取未来三天数据
  let threeDaysData = [];
  $(".forecast .days").each(function(i, elem) {
    // 循环获取未来几天天气数据
    const SingleDay = $(elem).find("li");
    threeDaysData.push({
      Day: $(SingleDay[0])
        .text()
        .replace(/(^\s*)|(\s*$)/g, ""),
      WeatherImgUrl: $(SingleDay[1])
        .find("img")
        .attr("src"),
      WeatherText: $(SingleDay[1])
        .text()
        .replace(/(^\s*)|(\s*$)/g, ""),
      Temperature: $(SingleDay[2])
        .text()
        .replace(/(^\s*)|(\s*$)/g, ""),
      WindDirection: $(SingleDay[3])
        .find("em")
        .text()
        .replace(/(^\s*)|(\s*$)/g, ""),
      WindLevel: $(SingleDay[3])
        .find("b")
        .text()
        .replace(/(^\s*)|(\s*$)/g, ""),
      Pollution: $(SingleDay[4])
        .text()
        .replace(/(^\s*)|(\s*$)/g, ""),
      PollutionLevel: $(SingleDay[4])
        .find("strong")
        .attr("class")
    });
  });

  return {
    moji: {
      addressText,
      weatherTip,
      nowInfo,
      threeDaysData
    }
  };
};
```

#### ③ 数据合并

异步获取两个数据

```js
const getAllData = async (city, location) => {
  let oneData = await getOne();
  let weatherData = await getWeather(city, location);
  const allData = { today: formatDate(), ...oneData, ...weatherData };
  return allData;
};
module.exports = getAllData;
```

### 2. 模版引擎生成 HTML

#### ① 模板编写

ejs 这种模板已经年老 更新不及时，所以换了更清晰更新的 nunjucks 因为邮件不支持外链 css 所以使用内联 css 虽然比较麻烦

使用刚获取到数据 模板渲染

```html
<!-- index.njk -->
<div style="padding: 0;max-width: 600px;margin: 0 auto;">
        <div style="width:100%; margin: 40px auto;font-size:20px; color:#5f5e5e;text-align:center">
            <span>今天是{{today}}</span>
        </div>
        <div style="width:100%; margin: 20px auto;font-size:16px;color:#2bbc8a;text-align: center;">
            <span><span style="font-family: Arial;font-size: 100px;line-height: 1;">{{moji.nowInfo.Temp}}</span><span style="vertical-align: top;">℃</span></span>
            <span style="font-size: 30px;padding-top: 50px;">{{moji.nowInfo.WeatherText}}</span>
        </div>
        <div style="text-align:center;font-size:12px;color:#d480aa">{{moji.addressText}}</dev>
        <div style="width:100%; margin: 0 auto;color:#5f5e5e;text-align:center">
            <span style="display:block;color:#676767;font-size:20px">{{moji.weatherTip}}</span>
            <span style="display:block;margin-top:15px;color:#676767;font-size:15px">近期天气预报</span>

            {% for item in moji.threeDaysData %}
            <div style="display: flex;margin-top:5px;height: 30px;line-height: 30px;justify-content: space-around;align-items: center;">
                <span style="width:15%; text-align:center;">{{ item.Day }}</span>
                <div style="width:25%; text-align:center;">
                    <img style="height:26px;vertical-align:middle;" src='{{ item.WeatherImgUrl }}' alt="">
                    <span style="display:inline-block">{{ item.WeatherText }}</span>
                </div>
                <span style="width:25%; text-align:center;">{{ item.Temperature }}</span>


                {% if (item.PollutionLevel==='level_1') %}
                    <div style="width:35%; ">
                            <span style="display:inline-block;padding:0 8px;line-height:25px;color:#8fc31f; border-radius:15px; text-align:center;">{{ item.Pollution }}</span>
                    </div>

                {% elif (item.PollutionLevel==='level_2') %}
                    <div style="width:35%; ">
                            <span style="display:inline-block;padding:0 8px;line-height:25px;color:#d7af0e; border-radius:15px; text-align:center;">{{ item.Pollution }}</span>
                    </div>

                {% elif (item.PollutionLevel==='level_3') %}
                    <div style="width:35%; ">
                            <span style="display:inline-block;padding:0 8px;line-height:25px;color:#f39800; border-radius:15px; text-align:center;">{{ item.Pollution }}</span>
                    </div>
                {% elif (item.PollutionLevel==='level_4') %}
                    <div style="width:35%; ">
                            <span style="display:inline-block;padding:0 8px;line-height:25px;color:#e2361a; border-radius:15px; text-align:center;">{{ item.Pollution }}</span>
                    </div>
                {% elif (item.PollutionLevel==='level_5') %}
                    <div style="width:35%; ">
                            <span style="display:inline-block;padding:0 8px;line-height:25px;color:#5f52a0; border-radius:15px; text-align:center;">{{ item.Pollution }}</span>
                    </div>
                {% elif (item.PollutionLevel==='level_6') %}
                    <div style="width:35%; ">
                            <span style="display:inline-block;padding:0 8px;line-height:25px;color:#631541; border-radius:15px; text-align:center;">{{ item.Pollution }}</span>
                    </div>
                {% else  %}
                <div style="width:35%; ">
                            <span style="display:inline-block;padding:0 8px;line-height:25px;color:#631541; border-radius:15px; text-align:center;">none</span>
                    </div>
                {% endif  %}
            </div>

            {% endfor %}
        </div>
        <div style="text-align:center;margin:35px 0;">
                <span style="display:block;margin-top:55px;color:#676767;font-size:15px">ONE · 一个</span>
                <img src="{{ one.imgSrc }}" style="max-width:100%;margin:10px auto;"  alt="">
                <span style="color:#b0b0b0;font-size:13px;">摄影</span>
                <div style="margin:10px auto;width:85%;color:#5f5e5e;" >{{one.info}}</div>
        </div>
    </div>
```

#### ② 模板渲染

node fs 模块 读取本地模板文件 抛出 渲染好的 html 结构数据

```js
const nunjucks = require("nunjucks");
const fs = require("fs");
const path = require("path");

const getHtmlData = njkData => {
  return new Promise((resolve, reject) => {
    try {
      const njkString = fs.readFileSync(
        path.resolve(__dirname, "index.njk"),
        "utf8"
      );
      const htmlData = nunjucks.renderString(njkString, njkData);
      resolve(htmlData);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = getHtmlData;
```

### 3. 使用 Node 发送邮件

这里使用 `nodemailer`

**注意的是邮箱密码不是你登录邮箱的密码，而是 smtp 授权码，什么是 smtp 授权码呢？就是你的邮箱账号可以使用这个 smtp 授权码在别的地方发邮件，一般 smtp 授权码在邮箱官网的设置中可以看的到.不知道的话可以使用邮箱账号及密码试试**

```js
const config = require("./../config");
const sendMail = (transporter, To, HtmlData) => {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: config.EmailFrom, // 发送者邮箱
      to: To, // 接收邮箱
      subject: config.EmailSubject, // // 邮件主题
      html: HtmlData //模板数据
    };
    transporter.sendMail(mailOptions, (error, info = {}) => {
      if (error) {
        console.error("邮件发送成功" + error);
        reject(error);
      } else {
        console.log("邮件发送成功", info.messageId);
        console.log("静等下一次发送");
        resolve();
      }
    });
  });
};
module.exports = sendMail;
```

### 4. 整合运行

```js
let transporter = nodemailer.createTransport({
  service: EmianService,
  port: 465,
  secureConnection: true,
  auth: EamilAuth,
  pool: true
});
const getAllDataAndSendMail = async () => {
  for (let i = 0, len = EmailToArr.length; i < len; i++) {
    try {
      let item = EmailToArr[i];
      let apiData = await getAllData(item.CITY, item.LOCATION);
      let htmlData = await getHtmlData(apiData);
      await sendMail(transporter, item.TO, htmlData);
    } catch (error) {
      console.error(error);
    }
  }
};
getAllDataAndSendMail();
```

### 5. 定时

这里用到了 `node-schedule` 来定时执行任务,它跟 `corn` 很类似 之不是基于`Node`的
具体用法可见 `node-schedule`文档
这里我使用了 每天早上的 08:15:58 定时发送 **尽量不取整点**

```js
const schedule = require("node-schedule");
const config = require("./config");
const scheduleRun = fn => {
  console.log("NodeMail: 开始等待目标时刻...");
  let j = schedule.scheduleJob(config.SENDDATE, function() {
    // SENDDATE: "58 15 8 * * *"
    console.log("开始执行任务......");
    fn();
  });
};
module.exports = scheduleRun;
```

所以只要 引入`scheduleRun`方法

```js
scheduleRun(getAllDataAndSendMail);
```

### 6. 配置详情

因为像邮件 smtp 授权码 是敏感信息 建议放进环境变量 `env2` 是个不错的工具 ,具体使用可以看`env2`文档

**具体配置详见[这里](/posts/713d3487/#配置)**

## 问题

### 1. 邮箱登陆失败

一般是在服务器上运行时,邮箱提供商安全机制 会阻止异地登陆 ,只要去邮箱提供商允许就可以了

### 2. 发送失败

因为多人定制因为邮件内容不一样,所以不是同一封邮件,会额外开辟一个线程发送,可能会超过邮件提供商允许线程
