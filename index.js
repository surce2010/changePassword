"use strict";

var http = require("https");
var cheerio = require("cheerio");
var querystring = require("querystring");

var accountName = "dingsh"; // 用户名
var originPassword = ""; // 初始密码
var expectPassword = ""; // 初始密码

var times = 0; // 记录执行的次数
var chgTimes = 10; // 预期执行的次数
chgPassword(originPassword, originPassword + times);

/**
 * 修改密码的递归函数
 * @param oldPassword 原密码
 * @param newPassword 新密码
 */
function chgPassword(oldPassword, newPassword) {
  var postData = querystring.stringify({
    __VIEWSTATE:
      "Luvn0rQ0aNlsX85pAwDYXmZ1tELMp47NLzrWAKGsVLw9UKxYOnmaYtrPk1dP0zz4ovX6yVINu3cfOOCgptutPLDdT2pvDm0wU0NbIuKjiEKN0k5v8uYB1ce5HLJeiYxKUeI0O15lbj/yrPm6MLEf0bl01f7By3ws4z1zYvJfdpC04hf7yXapeXNxOhtHvzPFhXVyxcrGgzpdDs7iBT/UEUg8OtlE5zaA0Pt9CPC7zrC9N9GMBBsOwnHtMedigDXdwdwXQtfSaiEf75JGN7hqhA4sYuK/HZB+4P2ee/ViWg9nhzKuQWuKwZ4+oCiFgL+okx+Y1ntGczNbC4I6PhwNRdqQ+amzQCI01AcABFo1m3pK3wDUa0jL/uSo0BnhVjTgFTOsPjmOcsjgpdt/pCLG43uN3NEIoj9UEOXU+MdL7Ux5ai4I7hcdLX+Mbc/igcnPqx+o5Na4ydujr9Lw5gKTTUTtGEYc8pSHoceB6Ba9ehStdrE8hqoMLjaQP1pYAbcn89iLkaWveOIQbkqmvzHeWnaDiz4zu6dbg3U0DbsYudBVxoUa1IN7PHyzx/sTld3ZmkTAMx+MR7Bo/pMZwQAsHOx9cvi9KvnPt+UmIzPKj3PBK0zfbVy45Xx/e2IOhI427P8gew==",
    __VIEWSTATEGENERATOR: "2B297099",
    __EVENTVALIDATION:
      "Ha5H4MTcDpMZF1nv49HvW1YiKp5ScNBMVcbGNB7aP/3FGyo+s7BzqzWeExAVTunkYkcvfCPxnXDTBo+4gAkYh12ea6UzjcT/kzEXqOaQI1pnDjXJRW3YvJ8EJXDkHOXTMWbYZfNj6QxF6y77lPG+zfZ2S4N5QpWhOdU3YvARdwDPb2T8Czd3fipo5PTSU00QjL5UtbWxOQHDsF3ZlpIUjKrcUXO26YUupTbAoBNzp1pjcoOxW5njlcef8rrqzdqIg4e6WA==",
    dropdownListDomainName: "AI",
    textBoxAccountName: accountName,
    textBoxOldPassword: oldPassword,
    textBoxNewPassword: newPassword,
    textBoxNewPasswordAgain: newPassword,
    buttonChangePassword: " Submit "
  });
  var options = {
    hostname: "chgpass.asiainfo.com",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length
    }
  };
  var req = http
    .request(options, function(res) {
      if (res.statusCode === 200) {
        var html = "";
        res
          .on("data", function(data) {
            html += data;
          })
          .on("end", function() {
            var $ = cheerio.load(html);
            if (
              $("#labelMessage")
                .text()
                .indexOf("密码修改成功") > -1
            ) {
              if (times === chgTimes) {
                console.log("密码修改成功，当前密码：" + newPassword);
              }
              if (times < chgTimes) {
                console.log("修改密码已执行" + (times + 1) + "次");
                chgPassword(
                  newPassword,
                  times === chgTimes - 1 ? expectPassword : newPassword + times
                );
                times++;
              }
            } else {
              console.log("密码修改失败，当前密码：" + oldPassword);
            }
          });
      } else {
        console.log("密码修改失败，当前密码：" + oldPassword);
      }
    })
    .on("error", function(e) {
      console.log(e, "error");
    });
  req.write(postData);
  req.end();
}
