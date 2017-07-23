
Album.saveMedia = function(fileData) {
    
    // // Data for POST
    // key: S3 key
    // org_filename: Original filename
    // filesize: Filesize in bytes
    // mime: File mime type
    // content_type: Content Type ID
    // status: 0=non-active, 1=active, 2=bin

    // // Return JSON object
    // ack: Status "ok", "err"
    // msg: Media ID if ack = ok

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

    // // Return JSON object
    // ack: Status "ok", "err"
    // msg: Metadata JSON or null

    return $.ajax({
                type: "POST",
                data: {id: id, key: key},
                url: '/api/media/save-exif',
                dataType: "json"
            });

}