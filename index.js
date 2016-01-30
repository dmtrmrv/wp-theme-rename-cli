#! /usr/bin/env node

// Dependencies.
var fs = require( 'fs' );

// Process user arguments.
var userArgs = process.argv.slice( 2 );
	newSLug  = userArgs[0];
	newName  = userArgs[1];

// Current theme details.
var dir,
	stylesheet,
	oldSlug,
	oldName;

// Read the directory.
dir = fs.readdirSync( '.' );

// If we have stylesheet, read it.
if ( typeof dir == 'object' && dir.indexOf( 'style.css' ) != -1 ) {
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

function renameTheme() {
}

renameTheme();