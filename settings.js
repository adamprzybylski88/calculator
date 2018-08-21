module.exports = () => {

	const fontExtensions = [
		'eot',
		'ttf',
		'woff',
		'woff2'
	]

	const imagesSizing = [
		{	'name': 'xsm',	'size': 250		},
		{	'name': 'sm', 	'size': 500		},
		{	'name': 'md',	'size': 800		},
		{	'name': 'hd',	'size': 1200	},
		{	'name': 'lg',	'size': 1400	},
		{	'name': 'fhd',	'size': 1900	}
	]

	const svgTransform = [
		{	colorName: 'light-green',
			hash: '#02F385',
			hashDarker: '#05aa5d'
		}
	]

	return [

		/* calc app */
		{
			'projName': 			'calculator',
			'projNameShort': 		'calc',
			'instanceName': 		'calc',
			'instanceNameShort': 	'calc',

			// 'proxy':	[
			// 				{
			// 					source: '/',
			// 					target: 'http://calc.offactory.com.local/'
			// 				}
			// ],

			'watch':	[ 
							'app/src/'
			],

			'src':		{	
							'base':		'app/src/',

							'less': 	'app/src/less/_base_structure.less',
							
							'js': 		'app/src/js/**/*.js',
                                        
                            'react':    'app/src/app.jsx'
			},

			'dist': 	{				
							'base': 	{ 
											'dir': 'app/dist',		
											'options': 	{ 
															'dirStructure': false
														}		
										},

							'styles': 	{ 
											'dir': 'app/dist',		
											'options': 	{ 
															'dirStructure': false
														}		
										},

							'scripts': 	{ 
											'dir': 'app/dist',		
											'options': 	{ 
															'dirStructure': false
														}		
										},

							'react': { 
											'dir': 'app/dist',		
											'options': 	{ 
															'dirStructure': false
														}		
										},

							'json': 	{ 
											'dir': 'app/dist/json',
											'options': 	{ 
															'dirStructure': false
														}		
										},

							'fonts': 	{ 
											'dir': 'app/dist/fonts',
											'extensions': fontExtensions,	
											'options': 	{ 
															'dirStructure': false
														}		
										},

							'images': 	{ 
											'dir': 'app/dist/img',
											'options': 	{ 
															'dirStructure': false,
															'imagesSizing': imagesSizing,
															'svg': 			svgTransform
														}		
										},

							'pdf': 		{ 
											'dir': 'app/dist',		
											'options': 	{ 
															'dirStructure': true
														}		
										}
			}
        }
        
	]
}