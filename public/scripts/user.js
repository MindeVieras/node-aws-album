Album.addUser = function() {
  
  $("#add_user").validate({
      rules: {
          username: {required: true}
      },
      submitHandler: function(form) {
        var data = {
            id: $('#add_user #id').val(),
            username: $('#add_user #username').val(),
            email: $('#add_user #email').val(),
            display_name: $('#add_user #display_name').val(),
            password: $('#add_user #password').val(),
            confirm_password: $('#add_user #confirm_password').val(),
            access_level: $('#add_user #access_level').val(),
            status: $('#add_user #status').is(":checked") ? 1 : 0
        };
        $.ajax({
          type: "POST",
          data: data,
          url: '/user/add',
          dataType: "json",
          success: function (res) {
            console.log(res);
            if (res.ack == 'ok') {
              window.location.replace('/users');
            }
            else {
              $('#add_user .error-msg').text(res.msg);
            }
          }
        });
        return false;
      }
  });
}