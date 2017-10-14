


Album.facesIndex = function(id, key) {
    
    // // Data for POST
    // id: Media ID
    // key: S3 key

    return $.ajax({
                type: "POST",
                data: {id: id, key:key},
                url: '/api/faces/index',
                dataType: "json"
            });

}

Album.addFacesCollection = function() {

  var data = {
    collection_id: $('#add_faces_collection #collection_id').val()
  };
  
  console.log(data);
  $.ajax({
    type: "POST",
    data: data,
    url: '/api/faces/add-new-collection',
    dataType: "json",
    success: function (res) {
      if (res.ack == 'ok') {
        console.log(res);
        Album.closeModal(true);
        // Photobum.initFilters();
      }
      else if (res.ack == 'form_err') {
        Album.initView();
        Album.scrollToTopOfModal();
        iziToast.error({
          title: 'Form error',
          message: res.msg
        });
      }
      else {
        Album.initView();
        Album.scrollToTopOfModal();
        iziToast.error({
          title: 'Can\'t save collection',
          message: 'Error: '+res.msg
        });
      }
    }
  });
  return false;

}

Album.deleteFacesCollection = function(info, btn) {

  var data = {
    collection_id: info.collection_id
  };

  $.ajax({
    type: "POST",
    data: data,
    url: '/api/faces/delete-collection',
    dataType: "json",
    success: function (res) {
      if (res.ack == 'ok') {
        $(btn).closest('.faces-collection-item').remove();
        iziToast.success({
          title: 'OK',
          message: res.msg
        });
      }
      else {
        iziToast.error({
          title: 'Can\'t delete collection',
          message: 'Error: '+res.msg
        });
      }
    }
  });
  return false;
}
