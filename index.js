#! /usr/bin/env node

// Dependencies.
var fs   = require( 'fs' );
var path = require( 'path' );

// Process user arguments.
var userArgs = process.argv.slice( 2 );
	newSlug  = userArgs[0];
	newName  = userArgs[1];

// Current theme details.
var themeDir, stylesheet, oldSlug, oldName;

// Excluded folders.
var excDir = [
	'./node_modules',
	'./fonts',
	'./assets/fonts'
]

// Excluded files.
var excFile = [
	'Gruntfile.js',
]

// File extensions to work with.
var incExt = [
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

// Read the themeDirectory.
themeDir = fs.readdirSync( '.' );

// If we have stylesheet, read it.
if ( typeof themeDir == 'object' && themeDir.indexOf( 'style.css' ) != -1 ) {
	stylesheet = fs.readFileSync( 'style.css', 'UTF8' );
}

// If stylesheet is not empty read the theme slug.
if ( stylesheet && stylesheet.search( /Text Domain:.*$/m ) != -1 ) {
	// Get the whole textdomain line.
	oldSlug = stylesheet.match( /Text Domain:.*$/m );

	// Trim everything except the slug.
	oldSlug = oldSlug[0].replace( 'Text Domain:', '' ).trim();
}

// If stylesheet is not empty read the Theme Name.
if ( stylesheet && stylesheet.search( /Theme Name:.*$/m ) != -1 ) {
	// Get the whole textdomain line.
	oldName = stylesheet.match( /Theme Name:.*$/m );

	// Trim everything except the Name.
	oldName = oldName[0].replace( 'Theme Name:', '' ).trim();
}

// Replace tasks.
function replaceStrings( file ) {
	// Get the content of the file.
	var content = fs.readFileSync( file, 'UTF8' );

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



	// Write the file.
	fs.writeFileSync( file, content, 'UTF8' );
}

function walkDir( dir ) {

	if ( dir[ dir.length-1 ] != '/' ) {
		dir = dir.concat('/')
	}

	items = fs.readdirSync( dir );
	
	items.forEach( function( item ) {
		if ( fs.statSync( dir + item ).isDirectory() ) {
			if ( excDir.indexOf( dir + item ) == -1 ) {
				walkDir( dir + item + '/' );
			} 
		} else if ( fs.statSync( dir + item ).isFile() ) {
			if ( incExt.indexOf( path.extname( dir + item ) ) != -1 ) {
				replaceStrings( dir + item );
			}
		}
	} );
};

walkDir( '.' );