
Album.saveMedia = function(fileData) {
    
    // // Data for POST
    // key: S3 key
    // org_filename: Original filename
    // filesize: Filesize in bytes
    // mime: File mime type
    // content_type: Content Type ID
    // status: 0=non-active, 1=active, 2=bin

    return $.ajax({
                type: "POST",
                data: fileData,
                url: '/api/media/save',
                dataType: "json"
            });

}

Album.saveExif = function(id, key) {
    
    // // Data for POST
    // id: Media ID
    // key: S3 key

    return $.ajax({
                type: "POST",
                data: {id: id, key: key},
                url: '/api/media/save-exif',
                dataType: "json"
            });

}

Album.generateThumb = function(key) {
    
    // // Data for POST
    // key: S3 key

    return $.ajax({
                type: "POST",
                data: {key:key},
                url: '/api/media/generate-thumb',
                dataType: "json"
            });

}

Album.rekognitionLabels = function(id, key) {
    
    // // Data for POST
    // id: Media ID
    // key: S3 key

    return $.ajax({
                type: "POST",
                data: {id: id, key:key},
                url: '/api/media/rekognition-labels',
                dataType: "json"
            });

}