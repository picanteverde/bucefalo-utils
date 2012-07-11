/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>*/'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 
              'src/bucefalo.namespace.js',
              'src/bucefalo.dictionary.js',
              'src/bucefalo.promise.js',
              'src/bucefalo.promise.when.js',
              'src/bucefalo.cache.js', 
              'src/bucefalo.cache.async.js',
              'src/bucefalo.monads.js',
              'src/bucefalo.monads.list.js',
              'src/bucefalo.monads.promise.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      },
      module: {
        src: ['<config:concat.dist.dest>', 'src/bucefalo.module.js'],
        dest: 'dist/<%= pkg.name %>.module.js'
      }
    },
    min: {
      dist: {
        src: ['<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      },
      module: {
        src: ['<config:concat.module.dest>'],
        dest: 'dist/<%= pkg.name %>.module.min.js'
      }
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js']//, 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        plusplus: false,
        smarttabs:true
      },
      globals: {
        bucefalo: true,
        console: true,
        module: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint concat min');

};
