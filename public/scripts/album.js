
Album.watchAlbumForm = function() {
  var options = {
    callback: function (value) {
      var oldValue = $(this).attr('value');

      if (value != oldValue) {
        Album.toogleSaveButton(true);
      } else {
        Album.toogleSaveButton(false);
      }
    },
    wait: 250,
    highlight: true,
    allowSubmit: false,
    captureLength: 1
  }

  $('#add_album #name').typeWatch(options);
}

Album.updateDates = function() {

    // make array of all dates
    var dates = $('.file-date-taken').map(function(){
        date = $(this).text();
        return date;
    }).get();

    dates = dates.filter(Boolean);
    
    dates.sort(function(a,b){
        return moment.utc(a).diff(moment.utc(b));
    });

    start_date = dates[0];
    end_date = dates.slice(-1).pop();

    $('#start_date').data("DateTimePicker").date(new Date(start_date));
    $('#end_date').data("DateTimePicker").date(new Date(end_date));
};

Album.toogleSaveButton = function(state) {
  if (state) {
    $('#footer-buttons #save-button').removeAttr('disabled');
  } else {
    $('#footer-buttons #save-button').attr('disabled', 'disabled');
  }
}

Album.addAlbum = function() {

  var data = {
    id: $('#add_album #id').val(),
    name: $('#add_album #name').val(),
    start_date: $('#add_album #start_date').data("DateTimePicker").date().format("YYYY-MM-DD HH:mm:ss"),
    end_date: $('#add_album #end_date').data("DateTimePicker").date().format("YYYY-MM-DD HH:mm:ss"),
    body: tinyMCE.get('album_body').getContent()
  };
  
  $.ajax({
    type: "POST",
    data: data,
    url: '/album/add',
    dataType: "json",
    success: function (res) {
      if (res.ack == 'ok') {

        Album.toogleSaveButton(false);
        
        // iziToast.success({
        //   title: res.msg
        // });

        // Atach new media files if any
        var mediaData = $('#add_album .uploaded-media-file').map(function(){
          return {
            media_id: $(this).attr('data-mediaid')
          }
        }).get();

        if (mediaData.length > 0 && res.id > 0) {
          
          // console.log(mediaData);
          // console.log('galima attachint');

          // Attach media files to Album
          Album.attachMedia(mediaData, res.id, 1).done(function(res) {
            console.log(res);

            // if (res.ack == 'ok') {
            //   $(file.previewElement).find('.status-thumb').show().addClass('success');
            // } else {
            //   $(file.previewElement).find('.status-thumb').show().addClass('error');
            // }
          }).fail(function() {
              //$(file.previewElement).find('.status-thumb').show().addClass('error');
              console.log(err);
              return;
          });
        
        } else {
          console.log('negalima attachinti');
        }

        window.location.replace('/album/edit/'+res.id);
        // window.location.reload();
      }
      else if (res.ack == 'form_err') {
        iziToast.error({
          title: 'Form error',
          message: res.msg
        });
      }
      else {
        iziToast.error({
          title: 'Can\'t save album',
          message: 'Error: '+res.msg
        });
      }
    }
  });
  return false;

  $('#add_album').validate({
      rules: {
          name: {required: true},
          start_date: {required: true},
          end_date: {required: true}
      },
      submitHandler: function(form) {

      }
  });
}

Album.attachMedia = function(mediaData, albumId, status) {
   
    // // Data for POST
    // media_id: Media ID
    // album_id: Album ID
    // status: File status

    return $.ajax({
                type: "POST",
                data: {media: mediaData, album_id: albumId, status: status},
                url: '/api/media/attach',
                dataType: "json"
            });
}

// Datepicker Add Album
Album.addAlbumDP = function() {
  // Start Datepicker
  $('#add_album #start_date').datetimepicker({
          format: 'YYYY-MM-DD, HH:mm:ss',
          date: moment()
      }
  );
  $('#add_album #start_date').on('dp.change', function (e) {
      Album.toogleSaveButton(true);
      $('#add_album #end_date').data("DateTimePicker").minDate(e.date);
  });

  // End Datepicker
  $('#add_album #end_date').datetimepicker({
          format: 'YYYY-MM-DD, HH:mm:ss',
          date: moment(),
          useCurrent: false
      }
  );

  $("#add_album #end_date").on("dp.change", function (e) {
      Album.toogleSaveButton(true);
      $('#add_album #start_date').data("DateTimePicker").maxDate(e.date);
  });
}

// Datepicker Edit Album
Album.editAlbumDP = function(start, end) {
  // Start Datepicker
  $('#add_album #start_date').datetimepicker({
          format: 'YYYY-MM-DD, HH:mm:ss',
          date: start
      }
  );
  $('#add_album #start_date').on('dp.change', function (e) {
      Album.toogleSaveButton(true);
      $('#add_album #end_date').data("DateTimePicker").minDate(e.date);
  });

  // End Datepicker
  $('#add_album #end_date').datetimepicker({
          format: 'YYYY-MM-DD, HH:mm:ss',
          date: end,
          useCurrent: false
      }
  );

  $("#add_album #end_date").on("dp.change", function (e) {
      Album.toogleSaveButton(true);
      $('#add_album #start_date').data("DateTimePicker").maxDate(e.date);
  });
}

Album.initDropzone = function() {

    $('#add_album').dropzone({
        init: function() {

            var dropzone = this;

            i = 1;
            this.on("addedfile", function(file) {

                // if(file.type.includes('image')){
                //     EXIF.getData(file, function() {
                //         var date = EXIF.getTag(this, 'DateTimeOriginal');

                //         $(file.previewElement).find('.file-date-taken').text(Album.convertExifDate(date));
                //     });
                // }

                // var preview = $(file.previewElement);
                // preview.attr('data-index', i++);

            });
            this.on("success", function(file, response) {

                // Data from S3 upload
                var fileData = {
                    key: response.key, // S3 key
                    org_filename: response.originalname,
                    filesize: response.size,
                    mime: response.mimetype,
                    content_type : 2, // Album
                    status : 0, // Non Active
                }

                // Save Media file
                Album.saveMedia(fileData).done(function(res) {
                    // After success saving to S3
                    if (res.ack == 'ok') {

                        Album.toogleSaveButton(true);
                        $(file.previewElement).addClass('uploaded-media-file').attr('data-mediaid', res.id);
                        $(file.previewElement).find('.status-s3').show().addClass('success');

                        type = file.type.includes('image') ? 'image' : 'video';
                        
                        // Run other processes if image
                        if(type == 'image'){
                            // Save image exif metadata
                            Album.saveExif(res.id, response.key).done(function(res) {                              
                              console.log(res);
                              if (res.ack == 'ok') {
                                $(file.previewElement).find('.status-exif').show().addClass('success');
                                $(file.previewElement).find('.file-date-taken').text(res.data.datetime);
                              } else {
                                $(file.previewElement).find('.status-exif').show().addClass('error');
                              }
                            }).fail(function() {
                              $(file.previewElement).find('.status-exif').show().addClass('error');
                              console.log(err);
                            });

                            // Generate thumbs
                            Album.generateThumb(response.key).done(function(res) {
                              // console.log(res);
                                if (res.ack == 'ok') {
                                    $(file.previewElement).find('.status-thumb').show().addClass('success');
                                } else {
                                    $(file.previewElement).find('.status-thumb').show().addClass('error');
                                }
                            }).fail(function() {
                                $(file.previewElement).find('.status-thumb').show().addClass('error');
                                console.log(err);
                            });

                            // Get and save image rekognition labels
                            Album.rekognitionLabels(res.id, response.key).done(function(res) {
                                //console.log(res);
                                if (res.ack == 'ok') {
                                    $(file.previewElement).find('.status-rekognition').show().addClass('success');
                                } else {
                                    $(file.previewElement).find('.status-rekognition').show().addClass('error');
                                }
                            }).fail(function() {
                                $(file.previewElement).find('.status-rekognition').show().addClass('error');
                                console.log(err);
                            });

                            // Get and save faces
                            Album.facesIndex(res.id, response.key).done(function(res) {
                                // console.log(res);
                                if (res.ack == 'ok') {
                                    $(file.previewElement).find('.status-faces').show().addClass('success');
                                } else {
                                    $(file.previewElement).find('.status-faces').show().addClass('error');
                                }
                            }).fail(function(err) {
                                $(file.previewElement).find('.status-faces').show().addClass('error');
                                console.log(err);
                            });
                        }

                        if(type == 'video'){
                            // var videoPath = s3bucket+response.location;
                            // var video = '<video class="saved-file" width="320" height="210" controls data-thumb-org="'+videoPath+'"><source src="'+videoPath+'" type="video/mp4">Your browser does not support HTML5 video.</video>';
                            // $(file.previewElement).find('.preview').append(video);
                            // $(file.previewElement).addClass('video-preview-item');
                        }

                    } else {
                        console.log(res.msg);
                        $(file.previewElement).find('.status-s3').show().addClass('error');
                    }

                }).fail(function() {
                    $(file.previewElement).find('.status-s3').show().addClass('error');
                    console.log(err);
                });

                $(file.previewElement).find('.progress-wrapper').hide();

            });
            this.on("removedfile", function(file) {
                indx = $(file.previewElement).attr('data-index');
                $('.file_url[data-index="'+indx+'"]').remove();
            });
            this.on("error", function(file, err) { 
              console.log(err);
            });

        },
        url: "/upload-media",
        createImageThumbnails: false,
        thumbnailWidth: 320,
        thumbnailHeight: 210,
        parallelUploads: 1,
        acceptedFiles: ".jpg,.jpeg,.png,.gif,.mp4,.mpg,.mkv,.avi",
        previewTemplate: $('#template').html(),
        headers: { 'Accept': "*/*" },
        previewsContainer: "#previews",
        clickable: ".fileinput-button"
    });
};


// PhotobumAdmin.albumsReady = function() {

    
//     //console.log('albums ready');

//     // // make media sortable
//     // if($('#previews').length){
//     //     var el = document.getElementById('previews');
//     //     var sortable = Sortable.create(el, {
            
//     //         dataIdAttr: 'data-',
//     //         // Element is chosen
//     //         onChoose: function (evt) {
//     //             evt.oldIndex;  // element index within parent
//     //         },

//     //         // Element dragging started
//     //         onStart: function (evt) {
//     //             evt.oldIndex;  // element index within parent
//     //         },

//     //         // Element dragging ended
//     //         onEnd: function (evt) {
//     //             console.log(evt.oldIndex);  // element's old index within parent
//     //             console.log(evt.newIndex);  // element's new index within parent
//     //             console.log(evt.item);
//     //             index = $(evt.item).attr('data-index');
//     //             $('.img_weight[data-weight="'+evt.newIndex+'"]').attr('data-weight', evt.oldIndex);
//     //             $('.img_weight[data-index="'+index+'"]').attr('data-weight', evt.newIndex);
//     //         },
//     //     });
//     // }

// };

// PhotobumAdmin.updateDates = function() {

//     // make array of all dates
//     var dates = $('.file-date-taken').map(function(){
//         date = $(this).text();
//         return date;
//     }).get();
    
//     dates = dates.filter(Boolean);
    
//     dates.sort(function(a,b){
//         return moment.utc(a).diff(moment.utc(b));
//     });

//     start_date = dates[0];
//     end_date = dates.slice(-1).pop();

//     $('#start_date').data("DateTimePicker").date(new Date(start_date));
//     $('#end_date').data("DateTimePicker").date(new Date(end_date));
// };

// PhotobumAdmin.viewAlbums = function() {
//     Photobum.initFilters();
//     //console.log('Viewing albums');
// };
// PhotobumAdmin.albumColorPicker = function() {
//     $(".color-album").spectrum("toggle");
// };
// PhotobumAdmin.addAlbum = function (info, btn) {

//     $('.alertholder').text('').removeClass('alert').removeClass('alert-danger');

//     var form_data = {
//         id: $('#id').val(),
//         name: $('#name').val(),
//         start_date: $('#start_date').data("DateTimePicker").date().format("YYYY-MM-DD HH:mm:ss"),
//         end_date: $('#end_date').data("DateTimePicker").date().format("YYYY-MM-DD HH:mm:ss"),
//         location_name: $('#location_name').val(),
//         locations: $('#add_album .album_loc').serializeArray(),
//         album_images: $('#add_album .img_url').map(function(){
//             return {
//                 name: $(this).attr('name'),
//                 filename: $(this).data('filename'),
//                 weight: $(this).data('weight'),
//                 file_type: $(this).data('type'),
//                 value: $(this).val()
//             }
//         }).get(),
//         files_remove: $('#add_album .file_remove').map(function(){
//             return {
//                 name: $(this).attr('name'),
//                 filename: $(this).data('filename'),
//                 weight: $(this).data('weight'),
//                 file_type: $(this).data('type'),
//                 value: $(this).val()
//             }
//         }).get(),
//         album_images_db: $('#add_album .img_url_db').map(function(){
//             return {
//                 media_id: $(this).data('id'),
//                 name: $(this).attr('name'),
//                 weight: $(this).data('weight'),
//                 value: $(this).val()
//             }
//         }).get(),
//         album_persons: $('#album_persons').select2('val'),
//         body: tinyMCE.get('album_body').getContent(),
//         color: $('.color-changed').attr('data-code'),
//         private: $('#album_private').bootstrapSwitch('state')
//     };
//     console.log(form_data);
//     //return false;

//     // make ajax post
//     $.ajax({
//         type: "POST",
//         data: form_data,
//         url: '/admin/albums/add',
//         dataType: "json",
//         success: function (data) {
//             console.log(data);
//             //return false;
//             if (data.ack == 'ok') {
//                 $('.alertholder').text('').removeClass('alert').removeClass('alert-danger');
//                 Photobum.closeModal();
//                 Photobum.initFilters();
//             }
//             else {
//                 $('.alertholder').text(data.msg).addClass('alert').addClass('alert-danger');
//                 Photobum.initView();
//                 Photobum.scrollToTopOfModal();
//             }
//         },
//         error: function(xhr){
//             console.log(xhr);
//         }
//     });
// };

// PhotobumAdmin.deleteAlbum = function (info, btn) {
//     //console.log(info);
//     Photobum.dialog({
//         message: 'Comfirm deletion of ' + info.name + '<br/>You know you can just unpublish from the edit screen right?',
//         title: "<i class=\"foreground news fa fa-exclamation-circle pad-right\"></i>Warning",
//         buttons: {
//             main: {
//                 label: "No! I've changed my mind",
//                 className: "btn btn-success",
//                 dismiss: true
//             },
//             danger: {
//                 label: "Yes! Delete it.",
//                 className: "btn btn-danger",
//                 dataFunction: "PhotobumAdmin.doDeleteAlbum",
//                 additionalData: {
//                     item: info.id,
//                     dir: info.dir,
//                     ladda: true
//                 },
//                 dismiss: false
//             }
//         }
//     });
// };

// PhotobumAdmin.doDeleteAlbum = function (info, btn) {
//     $.ajax({
//         type: "DELETE",
//         url: '/admin/albums/delete/id/'+info.item,
//         data: JSON.stringify({id: info.item}),
//         dataType: 'json',
//         success: function (data) {
//             dir_data = {
//                 dir: info.dir,
//             };
//             $.ajax({
//                 type: "POST",
//                 data: dir_data,
//                 url: '/api/utilities/delete-files',
//                 dataType: "json",
//                 success: function (data) {
//                     console.log(data);
//                 },
//                 error: function(xhr){
//                     console.log(xhr);
//                 }
//             });
//             if (data.ack == 'ok') {
//                 $('.dismissalertholder').text('').removeClass('alert').removeClass('alert-danger');
//                 Photobum.closeAllModals(true);
//             } else {
//                 $('.dismissalertholder').text(data.msg).addClass('alert').addClass('alert-danger');
//             }
//         }
//     });
// };