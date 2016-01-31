# WP Theme Rename CLI
Command line tool that renames WordPress themes.

# Installation
With [node.js](http://nodejs.org/) and [npm](http://github.com/isaacs/npm):

	npm install wp-theme-rename-cli

# Requirements

Theme must have the style.css with the proper Theme name and Text domain declarations.

# How to use

From the same folder with the style.css run the following command

	wp-theme-rename -s=slug -n=Name

This command will rename all prefixes, handles, text domains, Dockblock comments and other things with the ocurrances of the theme name.

# Parameters

	-s 

Reqired. New slug for the theme.

	-n

Reqired. New name for the theme.

	-folderExclude

Optional. Coma-separated list of folders to exclude from renaming. The default list of excludede folsers is node_modules, .git, .sass-cache, .hg, .svn, .CVS, cache.

	-fileExclude

Optional. Coma-separated list of files to exclude from renaming.

	-extensions

Optional. Coma-separated list of files to exclude from renaming. The default list of extensions is php, html, js, json, css, scss, sass, txt, md, pot.

# Examples

Let's say you want to reanme some theme to **Buster** with a **buster** slug.

	wp-theme-rename -s=buster -n=Buster -folderExclude=template-parts

Rename the theme but leave the **template-parts** folder intact.

	wp-theme-rename -s=buster -n=Buster -fileExclude=functions.php

Rename the theme but leave the **functions.php** file intact.

	wp-theme-rename -s=buster -n=Buster -extensions=php

Rename only php files.