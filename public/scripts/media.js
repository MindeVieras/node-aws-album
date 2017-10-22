
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

Album.generateVideos = function(key) {
    
    // // Data for POST
    // key: S3 key

    return $.ajax({
                type: "POST",
                data: {key:key},
                url: '/api/media/generate-videos',
                dataType: "json"
            });

}

Album.saveVideoMeta = function(id, key) {
    
    // // Data for POST
    // id: Media ID
    // key: S3 key

    return $.ajax({
                type: "POST",
                data: {id: id, key: key},
                url: '/api/media/save-video-meta',
                dataType: "json"
            });

}

Album.getImageUrl = function(key, style) {
    
    // // Data for POST
    // key: S3 key
    // style: media style name

    return $.ajax({
                type: "POST",
                data: {key: key, style: style},
                url: '/api/media/get-image-url',
                dataType: "json"
            });

}

Album.getVideoUrl = function(key, preset) {
    
    // // Data for POST
    // key: S3 key
    // preset: video preset name

    return $.ajax({
                type: "POST",
                data: {key: key, preset: preset},
                url: '/api/media/get-video-url',
                dataType: "json"
            });

}