"use strict";

var http = require("https");
var cheerio = require("cheerio");
var querystring = require("querystring");

var accountName = "caoyang3"; // 用户名
var originPassword = "cy15295730857!"; // 初始密码

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
      "AEyLx69rBdNHqDiOpA5HiqeArWOeBRg2MxD3CvaIHkwSFJVPWMuM9/lTNyYHF+gIgnLkhAZvbzQesoRGjHK9QXh9LpMFposRSWK1L5rVQ/aDwmbud6E6ETOQ1sPdkV0OatqPXr2Tu8ad3/lCdicbqWZpA0PUM6nkjg8waai4rrI1mERWXqrHlQ2IBUSlFQd15wXzypzQSu0RD62NMUNhZ/vMSEXNWorMIDJV44BzoAlBHQvTHcvw06XCqnoiXrC8HolmE4mT1wgDWQzuGXTqQLzZr+J493P+vIDjlwDzXqkfs2s5DwmsfwgIWID/cVVxzdPVHc28HJtQ+1akYOwvjF3JBzF3jVo5moZ3cCfrG5OzvN16hJh0H/bEAcRd2AirxFUMMaUi7FqVWzVOY30WJRr93Q59oFGTd26Ny2a+Ow0nc27NqXctKtI5h3CXI9zZkfFyVFs/0gXQ1YQtygl2yOht6VYr8yjrk89ZQsxb15rI7ucfgvkehuDGO0A1n+sNea+m06zSP7VbRcnwhRuyHLOacTQ=",
    __VIEWSTATEGENERATOR: "2B297099",
    __EVENTVALIDATION:
      "xbXPZuBIq3fStxmjIIUpbmdh6+xcPrRwuUIc6O9tgxqwsIazCSpjtrT3jE7+R6s4JkkZm7pn2JY9F5LMNFGOuD80nVG+6YU6RgbjRriAJ3LF+HRJ9ECTgMYbL0rX5V/cQyMQ8uOlNnvULOXwz0+TEvcgXNBM4TJJ4u2txDKpIfCeAsCRSm5MnB38HWEPJgJgFBFz+zO3YYrTLx5RJW/yuTwHeaHj6lA4TtBzqM7L5ec7eQe9oeAdLFDajlbWIMl2UNHnoA==",
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
                chgPassword(newPassword, times === chgTimes - 1 ? originPassword : newPassword + times);
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
