(function() {
  // * 底部时间
  function pad(num, length) {
    return length < num.toString().length
      ? num
      : (num / Math.pow(10, length)).toFixed(length).substr(2);
  }
  const startTimestamp = new Date("2019/01/01").getTime();
  const updateTimeStr = () => {
    let offset = parseInt((new Date().getTime() - startTimestamp) / 1000, 10),
      day = Math.floor(offset / 86400),
      hour = pad(Math.floor((offset % 86400) / 3600), 2),
      minute = pad(Math.floor(((offset % 86400) % 3600) / 60), 2),
      second = pad(Math.floor(((offset % 86400) % 3600) % 60), 2);
    $("#time-to-now").html(
      day + "天" + hour + "小时" + minute + "分钟" + second + "秒"
    );
    setTimeout(updateTimeStr, 1000);
  };
  updateTimeStr();
  //* 动态标题
  document.head || (document.head = document.getElementsByTagName("head")[0]);
  function changeFavicon(src) {
    let link = document.createElement("link");
    let oldLink = document.getElementById("dynamic-favicon");
    link.id = "dynamic-favicon";
    link.rel = "icon";
    link.href = src;
    if (oldLink) {
      document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
  }
  const title = document.title;
  // 不同浏览器 hidden 名称
  var hiddenProperty =
    "hidden" in document
      ? "hidden"
      : "webkitHidden" in document
      ? "webkitHidden"
      : "mozHidden" in document
      ? "mozHidden"
      : null;
  // 不同浏览器的事件名
  var visibilityChangeEvent = hiddenProperty.replace(
    /hidden/i,
    "visibilitychange"
  );
  //
  var onVisibilityChange = function() {
    if (!document[hiddenProperty]) {
      document.title = title;
      changeFavicon("/images/favicon.ico");
    } else {
      document.title = "快回来~~ " + title;
      changeFavicon("/images/favicon-zzz.ico");
    }
  };
  document.addEventListener(visibilityChangeEvent, onVisibilityChange);
})(window, document);
