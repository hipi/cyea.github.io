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
  var onVisibilityChange = function() {
    if (!document[hiddenProperty]) {
      document.title = title;
    } else {
      document.title = "╥﹏╥ 快回来~~ " + title;
    }
  };
  document.addEventListener(visibilityChangeEvent, onVisibilityChange);

  // Service Worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then(function(registration) {
          // 注册成功
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        })
        .catch(function(err) {
          // 注册失败:(
          console.log("ServiceWorker registration failed: ", err);
        });
    });
  }
})(window, document);
