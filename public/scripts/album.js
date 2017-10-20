
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
  console.log(data);
  $.ajax({
    type: "POST",
    data: data,
    url: '/album/add',
    dataType: "json",
    success: function (res) {
      if (res.ack == 'ok') {

        Album.toogleSaveButton(false);

        // Atach new media files if any
        var mediaData = $('#add_album .uploaded-media-file').map(function(){
          return {
            media_id: $(this).attr('data-mediaid')
          }
        }).get();

        if (mediaData.length > 0 && res.id > 0) {
          // Attach media files to Album
          Album.attachMedia(mediaData, res.id, 1);
        
        }

        if (data.id) {
          iziToast.success({
            title: res.msg
          });
        } else {
          // window.location.replace('/album/edit/'+res.id);
        }
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
                // console.log(file);
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

                        type = file.type.includes('image') ? 'image' : 'video';
                        
                        Album.toogleSaveButton(true);
                        $(file.previewElement).addClass('uploaded-media-file media-file').attr({'data-mediaid': res.id, 'data-type': type});
                        $(file.previewElement).find('.status-s3').show().addClass('success');
                        
                        // Run other processes if image
                        if(type == 'image'){
                            // Save image exif metadata
                            Album.saveExif(res.id, response.key).done(function(res) {                              
                              // console.log(res);
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
                                if (res.ack == 'ok') {
                                    $(file.previewElement).find('.status-thumb').show().addClass('success');
                                    // $(file.previewElement).css('background-image', res.msg);
                                    $(file.previewElement).find('.preview').css('background-image', 'url('+res.msg+')');
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
                          // Save image exif metadata
                          Album.saveVideoMeta(res.id, response.key).done(function(res) {                              
                            console.log(res);
                            // if (res.ack == 'ok') {
                            //   $(file.previewElement).find('.status-exif').show().addClass('success');
                            //   $(file.previewElement).find('.file-date-taken').text(res.data.datetime);
                            // } else {
                            //   $(file.previewElement).find('.status-exif').show().addClass('error');
                            // }
                          }).fail(function(err) {
                            // $(file.previewElement).find('.status-exif').show().addClass('error');
                            console.log(err);
                          });
                          // Generate videos
                          // Album.generateVideos(response.key).done(function(res) {
                          //   console.log(res);
                          //     // if (res.ack == 'ok') {
                          //     //     $(file.previewElement).find('.status-thumb').show().addClass('success');
                          //     //     // $(file.previewElement).css('background-image', res.msg);
                          //     //     $(file.previewElement).find('.preview').css('background-image', 'url('+res.msg+')');
                          //     // } else {
                          //     //     $(file.previewElement).find('.status-thumb').show().addClass('error');
                          //     // }
                          // }).fail(function(err) {
                          //     // $(file.previewElement).find('.status-thumb').show().addClass('error');
                          //     console.log(err);
                          // });
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

