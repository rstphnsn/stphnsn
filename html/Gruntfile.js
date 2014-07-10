module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
    });

    grunt.initConfig({

        jshint: {
            gruntfile: 'Gruntfile.js',
            app: ['dev/js/app.js', 'dev/js/modules/**/*.js'],
            specs: ['dev/js/tests/*.js'],
            options: {
                jshintrc: true
            }
        },

        clean: {
            options: {
                force: true /* Need force to clean beyond current working dir */
            },
            js: {
                src: ['assets/js/**/*','!assets/js/modernizr.custom.js']
            },
            css: {
                src: ['assets/css/**/*']
            }
        },

        sass: {
            prod: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'assets/css/styles.css': 'dev/scss/styles.scss'
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            scss: {
                files: ['dev/scss/*.scss'],
                tasks: ['scss']
            },
            js: {
                files: ['dev/js/**/*.js'],
                tasks: ['js']
            }/*,
            html: {
                files: ['*.html'],
                tasks: ['bust-appCache']
            }*/
        },

        uglify: {
            options: {
                message: 'We are now ugly',

                // mangle: Turn on or off mangling
                mangle: true,

                // beautify: beautify your code for debugging/troubleshooting purposes
                beautify: false,

                // compress: compresses the code into one
                compress: true,

                // report: Show file size report
                report: 'gzip'
            },
            js: {
                src: ['dev/js/app.js', 'dev/js/modules/module.*.js', 'dev/js/modules/page.*.js'],
                dest: 'assets/js/app.min.js'
            },
            libs: {
                src: ['dev/js/libs.js', 'dev/js/libs/*.js', '!dev/js/libs/jquery-*.js', '!dev/js/libs/modernizr.js'],
                dest: 'assets/js/libs.min.js'
            }
        },

        copy: {
            jquery: {
                src: ['dev/js/libs/jquery-*.js'],
                dest: 'assets/js/jquery.js'
            }
        },

        jasmine: {
            app: {
                src: ['dev/js/modules/*.js','dev/js/modules/*.js'],
                options: {
                    specs: 'dev/js/tests/*.spec.js',
                    vendor: ['assets/js/modernizr.custom.js','assets/js/jquery.js','assets/js/libs.min.js'],
                    helpers: 'dev/js/tests/*.helper.js'
                }
            }
        },

        modernizr: {
            site: {
                'devFile': 'dev/js/libs/modernizr.js',
                'outputFile': 'assets/js/modernizr.custom.js'
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 version', '> 1%', 'ff esr', 'ie >= 8', 'ios >= 5', 'android >= 2.3'],
                map: false
            },
            site: {
                src: 'assets/css/styles.css'
            }
        },

        manifest: {
            generate: {
                options: {
                    cache: [
                        'assets/images/spinner.png',
                        'assets/js/jquery.js',
                        'assets/js/modernizr.custom.js',
                        'assets/js/app.min.js',
                        'assets/css/styles.css'
                    ],
                    network: ['*'],
                    fallback: ['/ /offline.html'],
                    preferOnline: false,
                    verbose: true,
                    timestamp: true,
                    hash: false
                },
                src: [
                    '/',
                    'login/',
                    'training/',
                    'training/week-01/',
                    'training/week-01/day-01/',
                    'latest/',
                    'race/',
                    'me/'
                ],
                dest: 'mfc.appcache'
            }
        }

    });

    // With AppCache
    //grunt.registerTask('bust-appCache', ['manifest']);
    //grunt.registerTask('js', ['clean:js', 'copy:jquery', 'uglify', 'bust-appCache']);
    //grunt.registerTask('scss', ['clean:css', 'sass:prod', 'bust-appCache']);

    // No AppCache
    grunt.registerTask('js', ['jshint', 'jasmine', 'clean:js', 'copy:jquery', 'uglify:js', 'uglify:libs', 'modernizr']);
    grunt.registerTask('scss', ['clean:css', 'sass:prod', 'autoprefixer:site', 'modernizr']);

    // Targets
    grunt.registerTask('default', ['js', 'scss']);
};
