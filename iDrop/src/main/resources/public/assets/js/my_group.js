const userId = sessionStorage.getItem("userId");

document.addEventListener('DOMContentLoaded', function () {
    let req = JSON.stringify({});
    let param = '?userId='+userId;
    ajax('GET',
        '/getusergroup'+param,
        req,
        function (res) {
            var items = JSON.parse(res);
            // me as the host
            var host_HTML = ''
            const div_host_container = document.getElementById("host_container");
            div_host_container.innerHTML = '';
            for (let item in items[0]) {
                host_HTML += '<div style="clear: left;">\n' +
                    '              <p style="float: left;"><a href="innerGroup_page.html"><img src='+ items[0][item]["cover_url"] +' height="230px" width="180px" border="1px" style="margin-right: 20px"></a></p>\n' +
                    '              <p>Group Name: '+ items[0][item]["Group Name"] +'</p>\n' +
                    '              <p>Begin Date: '+ items[0][item]["Begin Date"] +'</p>\n' +
                    '              <p>Group Description: '+ items[0][item]["Group Description"] +'</p>\n' +
                    '            </div>';
            }
            div_host_container.innerHTML = host_HTML;

            //me as a member
            var member_HTML = ''
            const div_member_container = document.getElementById("member_container");
            div_member_container.innerHTML = '';
            for (let item in items[1]) {
                member_HTML += '<div style="clear: left;">\n' +
                    '              <p style="float: left;"><a href="innerGroup_page.html"><img src='+ items[1][item]["cover_url"] +' height="230px" width="180px" border="1px" style="margin-right: 20px"></a></p>\n' +
                    '              <p>Group Name: '+ items[1][item]["Group Name"] +'</p>\n' +
                    '              <p>Begin Date: '+ items[1][item]["Begin Date"] +'</p>\n' +
                    '              <p>Group Description: '+ items[1][item]["Group Description"] +'</p>\n' +
                    '            </div>';
            }
            div_member_container.innerHTML = member_HTML;
        },
        // failed callback
        function() {
            showErrorMessage('Cannot submit items.');
        });

    //application
    ajax('GET',
        '/getjoinmessage'+param,
        req,
        function (res) {
            var items = JSON.parse(res);

            var group_list = [];
            var user_list = [];
            var message_list = [];
            for (let item in items) {
                var group_name = Object.keys(items[item])[0];
                for (let m in Object.keys(items[item][group_name])) {
                    var message_name = Object.keys(items[item][group_name])[m]
                    if (items[item][group_name][message_name]["message"]) {
                        var message = items[item][group_name][message_name]["message"];
                        var user = items[item][group_name][message_name]["userId"];
                        group_list.push(group_name);
                        user_list.push(user);
                        message_list.push(message);
                    }
                }
            }
            sessionStorage.setItem("group_list", JSON.stringify(group_list));
            sessionStorage.setItem("user_list", JSON.stringify(user_list));
            sessionStorage.setItem("message_list", JSON.stringify(message_list));
        },
        // failed callback
        function() {
            showErrorMessage('Cannot submit items.');
        });
    var retrievedData1 = sessionStorage.getItem("group_list");
    var group_list = JSON.parse(retrievedData1);
    var retrievedData2 = sessionStorage.getItem("user_list");
    var user_list = JSON.parse(retrievedData2);
    var retrievedData3 = sessionStorage.getItem("message_list");
    var message_list = JSON.parse(retrievedData3);

    var application_HTML = '';
    const div_application_container = document.getElementById("application_container");
    div_application_container.innerHTML = '';
    if (group_list) {
        for (let i = 0; i < group_list.length; i++) {
            application_HTML += '<div style="clear: left;">\n' +
                '              <p style="float: left;"><img src="assets/img/application_form.jpg" height="200px" width="180px" border="1px" style="margin-right: 20px"></p>\n' +
                '              <p>Group Name: '+ group_list[i] +'</p>\n' +
                '              <p>Apply Message: '+ message_list[i] +'</p>\n' +
                '              <div class="application_list_content"><button class="application_list_btn" id="p'+ user_list[i] + group_list[i] +'" type="submit"><i class="fa fa-check"></i></button></div>\n' +
                '              <div class="application_list_content"><button class="application_list_btn" id="f'+ user_list[i] + group_list[i] +'" type="submit"><i class="fa fa-times"></i></button></div>\n' +
                '            </div>'
        }
    }

    div_application_container.innerHTML = application_HTML;
    if (group_list) {
        for (let i = 0; i < group_list.length; i++) {
            (function (){
                var group_name = group_list[i];
                var user_id = user_list[i];
                var click_flag = false;
                document.getElementById('p'+user_id+group_name).addEventListener('click', function (){
                    if (click_flag === false) {
                        click_flag = true;
                        console.log("pass click");
                        document.querySelector('#p' + user_id + group_name + ' i').style.color = '#ffc700';
                        document.getElementById("p" + user_id + group_name).style.cursor = 'auto';
                        document.getElementById("f" + user_id + group_name).style.cursor = 'auto';
                        let param = '?hostId='+userId+'&applicantId='+user_id+'&groupName='+group_name+'&add=true';
                        let req = JSON.stringify({});
                        ajax('POST', '/handleapplication'+param, req,
                            function (res){
                                if (res === "add success") {
                                    document.getElementById("modal_content").innerText = "add member successfully!";
                                    $('#myModal').modal('show');
                                } else {
                                    document.getElementById("modal_content").innerText = res;
                                    $('#myModal').modal('show');
                                }
                            },
                            // failed callback
                            function() {
                                showErrorMessage('Cannot submit items.');
                            });
                    }
                });

                document.getElementById('f'+user_id+group_name).addEventListener('click', function (){
                    if (click_flag === false) {
                        click_flag = true;
                        console.log("fail click");
                        document.querySelector('#f' + user_id + group_name + ' i').style.color = '#ffc700';
                        document.getElementById("f" + user_id + group_name).style.cursor = 'auto';
                        document.getElementById("p" + user_id + group_name).style.cursor = 'auto';
                        let param = '?hostId='+userId+'&applicantId='+user_id+'&groupName='+group_name+'&add=false';
                        let req = JSON.stringify({});
                        ajax('POST', '/handleapplication'+param, req,
                            function (res){
                                if (res === "reject success") {
                                    setTimeout(function () {
                                        alert("reject member successfully!");
                                    }, 10);
                                }
                            },
                            // failed callback
                            function() {
                                showErrorMessage('Cannot submit items.');
                            });
                    }
                });
            })();
        }
    }

});

/**
 * AJAX helper
 *
 * @param method -
 *            GET|POST|PUT|DELETE
 * @param url -
 *            API end point
 * @param callback -
 *            This the successful callback
 * @param errorHandler -
 *            This is the failed callback
 */
function ajax(method, url, data, callback, errorHandler) {
    var xhr = new XMLHttpRequest();
    var result = "";

    xhr.open(method, url, true);

    xhr.onload = function() {
        result = "sent";
        if (xhr.status === 200) {
            callback(xhr.responseText);
        } else {
            errorHandler();
        }
    };

    xhr.onerror = function() {
        result = "error";
        console.error("The request couldn't be completed.");
        errorHandler();
    };

    if (data === null) {
        xhr.send();
    } else {
        xhr.setRequestHeader("Content-Type",
            "application/json;charset=utf-8");
        xhr.send(data);
    }

    return result;
}
module.exports = ajax;