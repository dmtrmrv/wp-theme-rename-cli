#! /usr/bin/env node

// Dependencies.
var fs   = require( 'fs' );
var path = require( 'path' );

// Process user arguments.
var args = process.argv.slice( 2 );

//Define variables.
var oldSlug,
	oldName,
	newSlug,
	newName,
	themeDir,
	stylesheet;

// Excluded folders.
var folderExclude = [
	'node_modules',
	'.git',
	'.sass-cache',
	'.hg',
	'.svn',
	'.CVS',
	'cache',
]

// Excluded files.
var fileExclude = []

// File extensions to work with.
var extensions = [
	'.php',
	'.html',
	'.js',
	'.json',
	'.css',
	'.scss',
	'.sass',
	'.txt',
	'.md',
	'.pot'
]

// Process arguments.
for ( var i = 0; i < args.length; i++ ) {
	if ( args[ i ].indexOf( '-s' ) != -1 ) {
		newSlug = args[ i ].replace( '-s=', '' );
	} else if ( args[ i ].indexOf( '-n' ) != -1 ) {
		newName = args[ i ].replace( '-n=', '' );
	} else if ( args[ i ].indexOf( '-extensions' ) != -1 ) {
		extensions = args[ i ].replace( '-extensions=', '' ).split( ',' );
	} else if ( args[ i ].indexOf( '-folderExclude' ) != -1 ) {
		folderExclude = args[ i ].replace( '-folderExclude=', '' ).split( ',' );
	} else if ( args[ i ].indexOf( '-fileExclude' ) != -1 ) {
		fileExclude = args[ i ].replace( '-fileExclude=', '' ).split( ',' );
	}
}

// Return if no slug is provided.
if ( ! newSlug ) {
	console.log( 'No slug provided!' );
	return;
}

// Return in no name is provided.
if ( ! newName ) {
	console.log( 'No name provided!' );
	return;
}

// Read the themeDirectory.
themeDir = fs.readdirSync( '.' );

// If we have stylesheet, read it.
if ( typeof themeDir == 'object' && themeDir.indexOf( 'style.css' ) != -1 ) {
	stylesheet = fs.readFileSync( 'style.css', 'UTF8' );
} else {
	console.log( 'No style.css in the folder!' );
	return
}

// If stylesheet is not empty read the theme slug.
if ( stylesheet && stylesheet.search( /Text Domain:.*$/m ) != -1 ) {
	// Get the whole textdomain line.
	oldSlug = stylesheet.match( /Text Domain:.*$/m );

	// Trim everything except the slug.
	oldSlug = oldSlug[0].replace( 'Text Domain:', '' ).trim();
} else {
	console.log( 'Text domain is not defined!' );
	return
}

// If stylesheet is not empty read the Theme Name.
if ( stylesheet && stylesheet.search( /Theme Name:.*$/m ) != -1 ) {
	// Get the whole textdomain line.
	oldName = stylesheet.match( /Theme Name:.*$/m );

	// Trim everything except the Name.
	oldName = oldName[0].replace( 'Theme Name:', '' ).trim();
}  else {
	console.log( 'Theme name is not defined!' );
	return
}

// Check for a dot and and a slash at the beginning of the folder name and add it if necessary.
if ( folderExclude.length > 0 ) {
	for ( var i = 0; i < folderExclude.length; i++ ) {		
		if ( folderExclude[i].indexOf( './' ) != 0 )
			folderExclude[i] = './' + folderExclude[i];
	};
}

// Check for a dot and and a slash at the beginning of the file name and add it if necessary.
if ( fileExclude.length > 0 ) {
	for ( var i = 0; i < fileExclude.length; i++ ) {		
		if ( fileExclude[i].indexOf( './' ) != 0 )
			fileExclude[i] = './' + fileExclude[i];
	};
}

// Check for a dot at the beginning of the extension name and add it if necessary.
if ( extensions.length > 0 ) {
	for ( var i = 0; i < extensions.length; i++ ) {		
		if ( extensions[i].indexOf( '.' ) != 0 )
			extensions[i] = '.' + extensions[i];
	};
}

// Replace tasks.
function replaceStrings( file ) {

	// Get the content of the file.
	var content = fs.readFileSync( file, 'UTF8' );

	console.log( oldSlug, oldName, newSlug, newName );

	var old = content;

	// Replace the prefixes.
	content = content.replace(
		new RegExp( oldSlug + '_', 'g' ),
		newSlug + '_'
	);

	// Replace the handles.
	content = content.replace(
		new RegExp( oldSlug + '-', 'g' ),
		newSlug + '-'
	);

	// Replace text domain.
	content = content.replace(
		new RegExp( '\'' + oldSlug + '\'', 'g' ),
		'\'' + newSlug + '\''
	);

	// Replace Constants.
	content = content.replace(
		new RegExp( oldSlug.toUpperCase(), 'g' ),
		newSlug.toUpperCase()
	);

	// Docblocks space before.
	content = content.replace(
		new RegExp( ' ' + oldName, 'g' ),
		' ' + newName
	);

	// Docblocks space after.
	content = content.replace(
		new RegExp( oldName + ' ', 'g' ),
		newName + ' '
	);

	// Docblocks space before lowercase.
	content = content.replace(
		new RegExp( ' ' + oldSlug, 'g' ),
		' ' + newSlug
	);

	// Paths.
	content = content.replace(
		new RegExp( '/' + oldSlug, 'g' ),
		'/' + newSlug
	);

	// Strings in single quotes lowercase.
	content = content.replace(
		new RegExp( '\'' + oldSlug + '\'', 'g' ),
		'\'' + newSlug + '\''
	);

	// Strings in single quotes Uppercase.
	content = content.replace(
		new RegExp( '\'' + oldName + '\'', 'g' ),
		'\'' + newName + '\''
	);

	// Strings in double quotes lowercase.
	content = content.replace(
		new RegExp( '\"' + oldSlug + '\"', 'g' ),
		'\"' + newSlug + '\"'
	);

	// Strings in double quotes Uppercase.
	content = content.replace(
		new RegExp( '\"' + oldName + '\"', 'g' ),
		'\"' + newName + '\"'
	);

	// Markdown headings.
	content = content.replace(
		new RegExp( '#' + oldName, 'g' ),
		'#' + newName
	);

	console.log ( content == old );

	// Write the file.
	fs.writeFileSync( file, content, 'UTF8' );

}

/**
 * Walk the folder recursively and call the string replacing function.
 * @param  {string} dir Directory to walk
 */
function walkDir( dir ) {

	// Check if the directory name has a trailing slash and add it if necessary.
	if ( dir[ dir.length-1 ] != '/' ) {
		dir = dir.concat('/')
	}

	// Read all files and folders in the directory.
	items = fs.readdirSync( dir );
	
	// Loop through each of them.
	items.forEach( function( item ) {
		if ( fs.statSync( dir + item ).isDirectory() ) {
			if ( folderExclude.indexOf( dir + item ) == -1 ) {
				walkDir( dir + item + '/' );
			} 
		} else if ( fs.statSync( dir + item ).isFile() ) {
			if ( ( extensions.indexOf( path.extname( dir + item ) ) != -1 ) && ( fileExclude.indexOf( dir + item ) == -1 ) ) {
				replaceStrings( dir + item );
			}
		}
	} );
};

// Unleash the beast.
walkDir( '.' );

// Now start fresh with a new theme name!
console.log( 'All done!' );
