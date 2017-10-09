// Photobum.initFrontend = function() {

// };

Album.initView = function() {
    // Photobum.localize();
    // Photobum.initDotDtoDot();
    // Photobum.initSwitches();
    // Photobum.initColorPickers();
    // Photobum.initSelect();
    // Photobum.initFreewall();
    Album.initTips();
    // Album.initDatepicker();
    Album.initEditors();
    // Photobum.initMap();
};

// Photobum.initFilters = function() {
//     var filterCont = $('#toolbar .filters');
//     if(filterCont.length){
//         filterCont.addClass('scd');

//         var yearFilter = filterCont.find('.filter-year');

//         // set initial album list filter
//         $('.albums-container').empty().append('<div class="loader-spinner">loading...</div>');
//         $.ajax({
//             url: '/admin/albums/get/date/'+$(yearFilter).val(),
//             success: function(html) {
//                 $('.albums-container').empty().append(html);
//                 Photobum.initFreewall();
//             }
//         });

//         // Year filter event
//         yearFilter.change(function() {

//             console.log(this.value);

//             //return false;

//             //url = $(this).find('a').attr('href');

//             $('.albums-container').empty().append('<div class="loader-spinner">loading...</div>');

//             //$('ul.letters-tabs li').removeClass('active');
//             //$(this).addClass('active');

//             $.ajax({
//                 url: '/admin/albums/get/date/'+this.value,
//                 success: function(html){
//                     $('.albums-container').empty().append(html);
//                     Photobum.initFreewall();
//                 }
//             });

//             return false;
//         });
//     }
// };

// Photobum.initDotDtoDot = function() {

//     $('.title-dot').dotdotdot({
//         //  configuration goes here
//     });
// };


// Photobum.initSwitches = function() {
//     $('[data-checkbox="activeToggle"]').bootstrapSwitch(
//         {
//             onText: 'Active',
//             offText: 'Disabled',
//             onColor: 'success',
//             offColor: 'danger'
//         }
//     );

//     $('[data-checkbox="privateToggle"]').bootstrapSwitch(
//         {
//             onText: '<i class="fa fa-unlock"></i>',
//             offText: '<i class="fa fa-lock"></i>',
//             onColor: 'success',
//             offColor: 'danger'
//         }
//     );
// };

// Photobum.initColorPickers = function () {
    
//     // Album color palettte picker
//     if($('.color-album').length){    
//         colors = $('.color-album').data('pal');
//         palette = colors.split(',');

//         $('.color-album').spectrum({
//             preferredFormat: 'hex',
//             showPaletteOnly: true,
//             showPalette: true,
//             palette: palette,
//             showInput: false,
//             change: function(color){
//                 $(this).attr('data-code', color.toHex()).addClass('color-changed');
//                 $(this).attr('value', '#'+color.toHex());
//                 $('.modal-header').css('background-color', '#'+color.toHex());
//                 //console.log(color.toHex());
//             }
//         });
//     }

//     // Colors page pickers
//     $('.color-person').spectrum({
//         preferredFormat: 'hex',

//         change: function(color){
//             $(this).attr('data-code', color.toHex()).addClass('color-changed');
//             //console.log(color.toName());
//         }
//     });

//     if($('#select-color').length){    
//         colors = $('#select-color').data('pal');
//         palette = colors.split(',');

//         //console.log(palette);
//         $('#select-color').spectrum({
//             showPaletteOnly: true,
//             showPalette: true,
//             color: 'blanchedalmond',
//             palette: palette
//         });
//     }
  
// };

// Photobum.initSelect = function () {
    
//     $(".select2-simple").select2();
//     $(".select2-multiple").select2();
  
// };

// Photobum.initFreewall = function () {    

//     var usersWall = new Freewall('#album-users');
//     usersWall.fitWidth();
//     usersWall.reset({
//         selector: '.user-block',
//         animate: true,
//         cellW: 200,
//         cellH: 'auto',
//         onResize: function() {
//             usersWall.fitWidth();
//         }
//     });

//     var albumsWall = new Freewall('.albums-container');
//     albumsWall.reset({
//         selector: '.item',
//         animate: true,
//         cellW: 220,
//         cellH: 150,
//         onResize: function() {
//             //console.log(this);
//             albumsWall.refresh();
//         }
//     });
//     albumsWall.fitWidth();

// };

// Album Tooltips
Album.initTips = function () {
    const tipDefault = Array.from(document.querySelectorAll('.desktop .tip-default'));
    tippy(tipDefault);  
};

// Tinymce editors
Album.initEditors = function() {
    tinymce.remove();

    $("[data-tinymce]").each(function(){
        tinymce.init({
            skin_url: '/tinymce/skins/lightgray',
            insert_toolbar: false,
            menubar:false,
            selector: '#'+$(this).attr('id'),
            height: '150',
            setup: function(ed) {
               ed.on('change', function(e) {
                   Album.toogleSaveButton(true);
               });
            }
        });
    });
};

// Photobum.initMap = function() {
//     if($('#album_map').length){

//         var field = $('#album_markers');
//         var map;
//         map = new google.maps.Map(document.getElementById('album_map'), {
//             center: {lat: -34.397, lng: 150.644},
//             zoom: 15,
//             scrollwheel: false,
//             clickableIcons: false,
//             mapTypeId: 'terrain'
//         });

//         // This event listener calls addMarker() when the map is clicked.
//         clickIndex = 0;
//         google.maps.event.addListener(map, 'click', function(event) {

//             clickIndex++;
//             addMarker(event.latLng, map, clickIndex);

//             loc = event.latLng.lat()+','+event.latLng.lng();
//             field.append('<input name="album_loc[]" data-index="'+clickIndex+'" class="hidden album_loc" value="'+loc+'">');
//         });

//         // Address autocomplete
//         var input = document.getElementById('location_name');
//         var autocomplete = new google.maps.places.Autocomplete(input);

//         autocomplete.addListener('place_changed', function() {
//             var place = autocomplete.getPlace();
//             if (!place.geometry) {
//                 window.alert("Autocomplete's returned place contains no geometry");
//                 return;
//             }

//             map.setCenter(place.geometry.location);
//             // map.setZoom(15);

//             // var ac_marker = new google.maps.Marker({
//             //     position: place.geometry.location,
//             //     map: map,
//             //     draggable: true,
//             // });
//             // loc = place.geometry.location.lat()+','+place.geometry.location.lng();
//             // field.append('<input name="album_loc[]" data-index="2000000" class="album_loc" value="'+loc+'">');

//             // google.maps.event.addListener(ac_marker, 'dblclick', function(event) {
//             //     ac_marker.setMap(null);
//             //     $('.album_loc[data-index="2000000"]').remove();

//             // });

//             // google.maps.event.addListener(ac_marker, 'dragend', function(event) {
//             //     $('.album_loc[data-index="2000000"]').val(event.latLng.lat()+','+event.latLng.lng());

//             // });

//         });

//         // add static markers in edit mode
//         if($('.album_loc').length){    
//             $('.album_loc').each(function(i){

//                 latLng = $(this).val().split(',');
//                 var st_marker = new google.maps.Marker({
//                     position: {lat: parseFloat(latLng[0]), lng: parseFloat(latLng[1])},
//                     map: map,
//                     draggable: true,
//                 });

//                 i++;
//                 google.maps.event.addListener(st_marker, 'dblclick', function(event) {
//                     st_marker.setMap(null);
//                     index = i+1000000;
//                     $('.album_loc[data-index="'+index+'"]').remove();

//                 });

//                 google.maps.event.addListener(st_marker, 'dragend', function(event) {
//                     index = i+1000000;
//                     $('.album_loc[data-index="'+index+'"]').val(event.latLng.lat()+','+event.latLng.lng());

//                 });

//             });
//             map.setCenter({lat: parseFloat(latLng[0]), lng: parseFloat(latLng[1])});
//         }

//         // Adds a marker to the map.
//         addMarker = function(location, map, index) {
            
//             var marker = new google.maps.Marker({
//                 position: location,
//                 map: map,
//                 draggable: true,
//             });

//             google.maps.event.addListener(marker, 'dblclick', function(event) {
//                 marker.setMap(null);
//                 $('.album_loc[data-index="'+index+'"]').remove();

//             });

//             google.maps.event.addListener(marker, 'dragend', function(event) {

//                 $('.album_loc[data-index="'+index+'"]').val(event.latLng.lat()+','+event.latLng.lng());

//             });
//         };
//     }

// };


