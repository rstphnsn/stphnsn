module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt, {
        pattern: ['assemble', 'grunt-*', '!grunt-template-jasmine-istanbul']
    });

    grunt.initConfig({

        secret: grunt.file.readJSON('secret.json'),

        paths: {
            dev: 'dev',
            dist: 'html'
        },

        assemble: {
            options: {
                helpers: '<%= paths.dev %>/src/templates/helpers/**/*.js',
                assets: '<%= paths.dist %>/assets',
                layoutdir: '<%= paths.dev %>/src/templates/layouts/',
                partials: '<%= paths.dev %>/src/templates/partials/**/*.hbs',
                collections: [{
                    name: 'post',
                    sortby: 'posted',
                    sortorder: 'descending'
                }]
            },
            pages: {
                files: [{
                    cwd: '<%= paths.dev %>/src/content/',
                    src: ['**/*.hbs', '!_articles/**/*.hbs'],
                    expand: true,
                    dest: '<%= paths.dist %>/'
                },
                {
                    cwd: '<%= paths.dev %>/src/content/_articles/',
                    src: ['**/*.hbs'],
                    expand: true,
                    dest: '<%= paths.dist %>/blog/'
                }]
            }
        },

        jshint: {
            gruntfile: 'Gruntfile.js',
            app: ['<%= paths.dev %>/js/app.js', '<%= paths.dev %>/js/modules/**/*.js', '<%= paths.dev %>/js/pages/**/*.js'],
            specs: ['<%= paths.dev %>/js/tests/*.js'],
            options: {
                jshintrc: true
            }
        },

        clean: {
            options: {
                force: true /* Need force to clean beyond current working dir */
            },
            js: {
                src: ['<%= paths.dist %>/assets/js/**/*', '!<%= paths.dist %>/assets/js/modernizr.custom.js']
            },
            jspostbuild: {
                src: ['<%= paths.dist %>/assets/js/app.min.js', '<%= paths.dist %>/assets/js/libs.min.js', '<%= paths.dist %>/assets/js/jquery.js']
            },
            css: {
                src: ['<%= paths.dist %>/assets/css/**/*']
            },
            csspostbuild: {
                src: ['<%= paths.dist %>/assets/css/styles.css.map']
            },
            images: {
                src: ['<%= paths.dist %>/assets/images/**/*']
            },
            fonts: {
                src: ['<%= paths.dist %>/assets/fonts/**/*']
            },
            html: {
                src: ['<%= paths.dist %>/*', '!<%= paths.dist %>/assets/**']
            }
        },

        sass: {
            prod: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= paths.dist %>/assets/css/styles.css': '<%= paths.dev %>/scss/styles.scss'
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },
            scss: {
                files: ['<%= paths.dev %>/scss/*.scss'],
                tasks: ['scss']
            },
            js: {
                files: ['<%= paths.dev %>/js/**/*.js'],
                tasks: ['js']
            },
            html: {
                files: ['<%= paths.dev %>/src/**/*.hbs'],
                tasks: ['assembleio']
            },
            images: {
                files: ['<%= paths.dev %>/images/**/*'],
                tasks: ['images']
            },
            fonts: {
                files: ['<%= paths.dev %>/fonts/**/*'],
                tasks: ['fonts']
            },
            root: {
                files: ['<%= paths.dev %>/root/**/*'],
                tasks: ['assembleio']
            }
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
                src: ['<%= paths.dev %>/js/app.js', '<%= paths.dev %>/js/modules/*.js', '<%= paths.dev %>/js/pages/*.js'],
                dest: '<%= paths.dist %>/assets/js/app.min.js'
            },
            libs: {
                src: ['<%= paths.dev %>/js/libs.js', '<%= paths.dev %>/js/libs/*.js', '!<%= paths.dev %>/js/libs/jquery-*.js', '!<%= paths.dev %>/js/libs/modernizr.js'],
                dest: '<%= paths.dist %>/assets/js/libs.min.js'
            }
        },

        concat: {
            options: {
              separator: ';',
            },
            js: {
                src: ['<%= paths.dist %>/assets/js/jquery.js', '<%= paths.dist %>/assets/js/libs.min.js', '<%= paths.dist %>/assets/js/app.min.js'],
                dest: '<%= paths.dist %>/assets/js/scripts.min.js'
            }
        },

        copy: {
            jquery: {
                src: ['<%= paths.dev %>/js/libs/jquery-*.js'],
                dest: '<%= paths.dist %>/assets/js/jquery.js'
            },
            images: {
                expand: true,
                cwd: '<%= paths.dev %>/images/',
                src: ['**/*'],
                dest: '<%= paths.dist %>/assets/images/'
            },
            fonts: {
                expand: true,
                cwd: '<%= paths.dev %>/fonts/',
                src: ['**'],
                dest: '<%= paths.dist %>/assets/fonts/'
            },
            root: {
                expand: true,
                cwd: '<%= paths.dev %>/root/',
                src: ['**', '.htaccess'],
                dest: '<%= paths.dist %>/'
            }
        },

        jasmine: {
            app: {
                src: ['<%= paths.dev %>/js/modules/*.js','<%= paths.dev %>/js/pages/*.js'],
                options: {
                    specs: '<%= paths.dev %>/js/tests/*.spec.js',
                    vendor: ['<%= paths.dist %>/assets/js/modernizr.custom.js', '<%= paths.dist %>/assets/js/jquery.js', '<%= paths.dist %>/assets/js/libs.min.js'],
                    helpers: '<%= paths.dev %>/js/tests/*.helper.js'
                }
            }
        },

        modernizr: {
            site: {
                'devFile': '<%= paths.dev %>/js/libs/modernizr.js',
                'outputFile': '<%= paths.dist %>/assets/js/modernizr.custom.js'
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 version', '> 1%', 'ff esr', 'ie >= 8', 'ios >= 5', 'android >= 2.3'],
                map: false
            },
            site: {
                src: '<%= paths.dist %>/assets/css/styles.css'
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    cwd: '<%= paths.dist %>/',
                    dest: '<%= paths.dist %>/',
                    expand: true,
                    src: '**/*.<%= paths.dist %>'
                }]
            }
        },

        shell: {
            deploy: {
                command: 'sshpass -p "<%= secret.password %>" scp -r <%= paths.dist %> <%= secret.username %>@<%= secret.host %>:domains/stphnsn.com'
            }
        }

    });

    grunt.registerTask('js', ['jshint', 'clean:js', 'copy:jquery', 'uglify:js', 'uglify:libs', 'concat:js', 'clean:jspostbuild']);
    grunt.registerTask('scss', ['clean:css', 'sass:prod', 'autoprefixer:site', 'clean:csspostbuild']);
    grunt.registerTask('images', ['clean:images', 'copy:images']);
    grunt.registerTask('fonts', ['clean:fonts', 'copy:fonts']);
    grunt.registerTask('assembleio', ['clean:html', 'assemble', 'copy:root', 'htmlmin']);

    grunt.registerTask('default', ['assembleio', 'js', 'scss', 'images', 'fonts']);
    grunt.registerTask('deploy', ['default', 'shell']);

};