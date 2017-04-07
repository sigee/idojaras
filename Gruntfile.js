module.exports = function (grunt) {
    require('google-closure-compiler').grunt(grunt);

	grunt.loadNpmTasks('grunt-zip');	

    grunt.initConfig({
        'closure-compiler': {
            my_target: {
                files: {
                    'chrome/content/all.min.js': ['src/**/*.js']
                },
                options: {
                    compilation_level: 'WHITESPACE_ONLY', //should be 'SIMPLE', // should be 'ADVANCED'
                    language_in: 'ECMASCRIPT5_STRICT',
                    language_out: 'ECMASCRIPT5_STRICT',
                    warning_level: 'VERBOSE',
                    create_source_map: 'chrome/content/all.min.js.map',
                }
            }
        },
		'zip': {
			'build/addon.xpi': ['chrome/**', 'defaults/**', 'locale/**', 'skin/**', 'chrome.manifest', 'install.rdf']
		}		
    });

    // Default task(s).
	grunt.registerTask('build', ['closure-compiler', 'zip']);
    grunt.registerTask('default', ['build']);

};
