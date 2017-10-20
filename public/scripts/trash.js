
Album.moveToTrash = function(info, btn) {
  var id = parseInt(info.mediaid);
  
  $.ajax({
    type: "POST",
    data: {id: id},
    url: '/api/media/move-to-trash',
    dataType: "json",
    success: function (res) {
      if (res.ack == 'ok') {
        $(btn).closest('.media-file').remove();
        iziToast.success({
          title: 'OK',
          message: res.msg
        });
      }
      else {
        iziToast.error({
          title: 'Can\'t recover file',
          message: 'Error: '+res.msg
        });
      }
    }
  });
  return false;
}

Album.trashHardDelete = function(info, btn) {

  var id = parseInt(info.mediaid);
  var type = info.type;

  $.ajax({
    type: "POST",
    data: {id: id, type: type},
    url: '/api/media/hard-delete',
    dataType: "json",
    success: function (res) {
      if (res.ack == 'ok') {
        $(btn).closest('.list-item').remove();
        iziToast.success({
          title: 'OK',
          message: res.msg
        });
      }
      else {
        iziToast.error({
          title: 'Can\'t delete file',
          message: 'Error: '+res.msg
        });
      }
    }
  });
  return false;
}

Album.trashRecover = function(info, btn) {

  var id = parseInt(info.mediaid);
  
  $.ajax({
    type: "POST",
    data: {id: id},
    url: '/api/media/trash-recover',
    dataType: "json",
    success: function (res) {
      if (res.ack == 'ok') {
        $(btn).closest('.list-item').remove();
        iziToast.success({
          title: 'OK',
          message: res.msg
        });
      }
      else {
        iziToast.error({
          title: 'Can\'t recover file',
          message: 'Error: '+res.msg
        });
      }
    }
  });
  return false;
}


