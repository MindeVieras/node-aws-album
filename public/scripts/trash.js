
Album.moveToTrash = function(info, btn) {

  var id = parseInt(info.mediaid);
  
  $.ajax({
    type: "POST",
    data: {id: id},
    url: '/api/media/move-to-trash',
    dataType: "json",
    success: function (res) {
      if (res.ack == 'ok') {
        // index = $(btn).attr('data-index');
        // $('.file_url_db[data-index="'+index+'"]').addClass('file_remove');
        $(btn).closest('.list-group-item').remove();
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

  // console.log(btn);
  console.log(info);
  var id = parseInt(info.mediaid);
  // // var btn = this;
  console.log(id);
  $.ajax({
    type: "POST",
    data: {id: id},
    url: '/api/media/hard-delete',
    dataType: "json",
    success: function (res) {
      // console.log(res);
      // console.log(btn);
      if (res.ack == 'ok') {
        // index = $(btn).attr('data-index');
        // $('.file_url_db[data-index="'+index+'"]').addClass('file_remove');
        // $(btn).closest('.list-group-item').remove();
      }
      else {
        console.log('cannot delete media file');
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
        $(btn).closest('.trash-item').remove();
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


