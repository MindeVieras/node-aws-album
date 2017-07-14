//Gruntfile
'use strict';

module.exports = function(grunt) {

    //Initializing the configuration object
    grunt.initConfig({
        // Sass
        sass: {
            web: {
                options: {
                    style: 'compressed'
                },
                files: {
                    './public/css/styles.min.css': './public/sass/web/main.scss'
                }
            },
            login: {
                options: {
                    style: 'compressed'
                },
                files: {
                    './public/css/login.min.css': './public/sass/login/login.scss'
                }
            }
        },
        // bower_concat: {
        //     web: {
        //         dest: {
        //             js: './assets/js/bower/web.js'
        //         },
        //         include: [
        //             'jquery',
        //             //'izimodal'
        //             'jquery-validation',
        //             'parsleyjs'
        //         ]
        //     }
        // },
        //JS
        // uglify: {
        //     web: {
        //         files: {
        //             './assets/js/scripts.min.js': [
        //                 './app/assets/js/Web/*.js'
        //             ]
        //         },
        //         options: {
        //             beauty: true,
        //             mangle: false,
        //             compress: false,
        //             sourceMap: true
        //         }
        //     },
        //     bower: {
        //         files: {
        //             './assets/js/login-libs.min.js': ['./assets/js/bower/login.js'],
        //             './assets/js/libs.min.js': ['./assets/js/bower/web.js']
        //         },
        //         options: {
        //             beauty: true,
        //             mangle: false,
        //             compress: false,
        //             sourceMap: true
        //         }
        //     }
        // },
        // Watch
        watch: {
            // js_web: {
            //     files: ['./app/assets/js/Web/**/*.js'],
            //     tasks : [
            //         'uglify:web'
            //     ]
            // },
            sass_web: {
                files: ['./public/sass/web/**/*.scss'],
                tasks: [
                    'sass:web'
                ]
            },
            sass_login: {
                files: ['./public/sass/login/**/*.scss'],
                tasks: [
                    'sass:login'
                ]
            },
            templates: {
                files: ['./views/**/*.handlebars']
            },
            // classes: {
            //     files: ['./app/classes/**/*.php']
            // },
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Task definition
    grunt.registerTask('default', [
        //'bower_concat',
        'sass',
        //'uglify',
        'watch'
    ]);

    // grunt.registerTask('admin', [
    //     'sass:admin',
    //     //'bower_concat:admin',
    //     'uglify:admin',
    //     'watch'
    // ]);

    // grunt.registerTask('web', [
    //     'sass:web',
    //     'uglify:web',
    //     'watch'
    // ]);

    // grunt.registerTask('installer', [
    //     'sass:install',
    //     'uglify:install',
    //     'watch:install'
    // ]);

};
