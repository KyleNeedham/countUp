
module.exports = function(grunt)
{
  grunt.loadNpmTasks('grunt-growl');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Core tasks
  coreTasks = ['coffee', 'growl:coffee', 'jasmine', 'growl:jasmine', 'uglify'];

  // Counter configuration
  grunt.initConfig({
    uglify: {
      dist: {
        files: {
          'dist/counter.min.js': 'dist/counter.js'
        }
      }
    },
    coffee: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '*.coffee',
          dest: 'dist/',
          ext: '.js'
        }]
      },
      specs: {
        files: [{
          expand: true,
          cwd: 'spec/coffeescripts/',
          src: '*.spec.coffee',
          dest: 'spec/javascripts/',
          ext: '.spec.js'
        }]
      }
    },
    jasmine: {
      src: ['dist/counter.js'],
      options: {
        specs: 'spec/javascripts/**/*.spec.js'
      }
    },
    watch: {
      files: [
        'src/*',
        'spec/coffeescripts/**/*.spec.coffee'
      ],
      tasks: coreTasks
    },
    growl: {
      coffee: {
        title: 'CoffeeScript',
        message: 'Compiled yo awesome coffee bro!'
      },
      jasmine:
      {
        title: 'Jasmine',
        message: 'Tests Passed'
      },
    }
  });

  grunt.registerTask('default', coreTasks);
  grunt.registerTask('travis', ['coffee', 'jasmine']);
};