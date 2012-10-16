var fs = require('fs'),
	util = require('util'),
	basePath = './';

/* Helper functions */

/* Remove hidden/system files */
function removeHiddenFiles(files) {
	for(var i=0, l=files.length; i<l; i++) {
		var file = files[i];

		if(!file || file.indexOf('.') == 0) {
			files.splice(i, 1);
		}
	}
}

//Sort in rever order
function reverseSort(arr) {
	arr.sort();
	arr.reverse();
	return arr;
}

// Make an array of uniue elements
function uniqueArray(arr) {
    var o = {}, i, l = arr.length, r = [];
    for(i=0; i<l;i+=1) o[arr[i]] = arr[i];
    for(i in o) r.push(o[i]);
    return r;
}

/* 
 * Loop though main directory and create a 
 * list of links to previous verisons of jQuery
 *
 */
function getjQueryVersions() {
	var previous = [],
		files = fs.readdirSync(basePath);

	//Remove hidden files
	removeHiddenFiles(files);

	//Loop through files
	for(var i=0, l=files.length; i<l; i++) {
		var file = files[i],
			stats = fs.statSync(basePath + file);

		//exclude lates verison and store previous releases in an array
		if(!(/^jquery(:?\.min|-git)?\.js/).exec(file) && stats.isFile()) {
			previous.push('<a href="/' + file + '">' + file + '</a>');
		}
	}

	//Return previous release array sorted in reverse alphabetical order
	return reverseSort(previous);
}

/* 
 * Loop though mobile/latest directory and create a 
 * list of links to jQuery mobile git live version
 *
 */
function getjQueryMobileGitVersion() {
	var path = basePath + '/mobile/latest/',
		git = [],
		files = fs.readdirSync(path);

	//Remove hidden files
	removeHiddenFiles(files);

	//Store files from "latest" dir in array
	for(var i=0, l=files.length; i<l; i++) {
		var file = files[i],
			stats = fs.statSync(path + file);

		if(stats.isFile() && (/^jquery\.mobile\./).exec(file)) {
			git.push('<a href="/mobile/' + file + '">' + file + '</a>');
		}
	}

	return reverseSort(git);
}

/* 
 * Loop though mobile/ directory and create a 
 * list of links to jQuery mobile git live version
 *
 */
function getjQueryMobileLatest() {
	var js = [],
		zip = [],
		css = [],
		path = basePath + '/mobile/',
		files = fs.readdirSync(path);

	//Remove hidden files and "latest" directory
	removeHiddenFiles(files);
	
	for(var i=0, l=files.length; i<l; i++) {
		if(files[i] == 'latest') {
			files.splice(i, 1);
			break;
		}
	}

	//Sort directories on time last updated
	files.sort(function(a, b) {
		var aStat = fs.statSync(path + a),
			bStat = fs.statSync(path + b);
		
		return bStat.mtime.getTime() - aStat.mtime.getTime();
	});

	//Get file list for most recently updated directory
	var latestDir = files[0];
	files = fs.readdirSync(path + latestDir);

	//Sort files ino arrays by type
	for(var i=0, l=files.length; i<l; i++) {
		var file = files[i],
			href = '<a href="/mobile/' + latestDir  + '/' + file + '">' + file;

		if(file.indexOf('.js') > -1) {
			js.push(href);
		} else if(file.indexOf('.css') > -1) {
			css.push(href);
		} else if(file.indexOf('.zip') > -1) {
			zip.push(href);
		}
	}

	//Return 1 array with .js files first, .css sencond and last .zip
	return js.concat(css).concat(zip);
}

function getjQueryMobilePrevious() {
	var previous = [],
		path = basePath + '/mobile/',
		files = fs.readdirSync(path);

	//Remove hidden files and "latest" directory
	removeHiddenFiles(files);
	
	for(var i=0, l=files.length; i<l; i++) {
		if(files[i] == 'latest') {
			files.splice(i, 1);
			break;
		}
	}

	//Sort directories on time last updated
	files.sort(function(a, b) {
		var aStat = fs.statSync(path + a),
			bStat = fs.statSync(path + b);

		return bStat.mtime.getTime() - aStat.mtime.getTime();
	});
	
	for(var i=0, len=files.length; i<len; i++) {
		var file = files[i],
			stat = fs.statSync(path + file);
		
		if(stat.isDirectory()) {
			var subFiles =fs.readdirSync(path + file);

			previous.push('<h2>' + file + '</h2>');
			
			for(j=0, flen=subFiles.length; i<flen; i++) {
				var subFile = subFiles[i],
					subStat = fs.statSync(path + file + '/' + subFile);

				if(subStat.isFile) {
					previous.push('<a href="/mobile/' + file + '/' + subFile + '">' + subFile + '</a>');
				}
			}
		}
	}

	return previous;
}

function getjQueryUIGit() {
	var git = [],
		path = basePath + '/ui/',
		files = fs.readdirSync(path);

	
	for(var i=0, len=files.length; i<len; i++) {
		var file = files[i],
			stat = fs.statSync(path + file);

		if(stat.isFile()) {
			git.push('<a href="/ui/' + file +'">' + file + '</a>');
		}
	}
	
	return reverseSort(git);
}

function getjQueryUIVersions() {
	var versions = [],
		path = basePath + '/ui/',
		files = fs.readdirSync(path);

	//Sort directories on time last updated
	files.sort(function(a, b) {
		var aStat = fs.statSync(path + a),
			bStat = fs.statSync(path + b);

		return bStat.mtime.getTime() - aStat.mtime.getTime();
	});

	for(var i=0, len=files.length; i<len; i++) {
		var file = files[i],
			stat = fs.statSync(path + file);

		if(stat.isDirectory() && file != 'images') {
			versions.push('<h1>jQuery UI ' + file + '</h1>');
			versions.push(processjQueryUIVersion(path + file, file));
		}
	}
	
	return versions;
}

function processjQueryUIVersion(path, dir) {
	var files = fs.readdirSync(path),
		ui = [];
	
	for(var i=0, l=files.length; i<l; i++) {
		var file = files[i],
			stat = fs.statSync(path + '/' + file);
		
		if(stat.isFile()) {
			ui.push('<a hef="/ui/' + dir + '/' + file + '">' + file + '</a>');
		}
	}
	
	ui.push('<div class="list"><h2>Themes</h2>');
	
	files = fs.readdirSync(path + '/themes');
	for(var i=0, l=files.length; i<l; i++) {
		var file = files[i],
			stat = fs.statSync(path + '/themes/' + file);
		
		if(stat.isFile()) {
			ui.push('<a hef="/ui/' + dir + '/themes/' + file + '">' + file + '</a>');
		}
	}
	
	ui.push('</div>');
	
	return ui.join('');
}

function getjQueryColors() {
	var git = [],
		versions = [],
		headings = [],
		version,
		js = [],
		svg = [],
		plus = [],
		path = basePath + '/color/',
		files = fs.readdirSync(path);
	
	for(var i=0, l=files.length; i<l; i++) {
		var file = files[i],
			href = '<a href="/ui/' + file +'">' + file + '</a>',
			stat = fs.statSync(path + file);

		if(/git/.exec(file) && stat.isFile()) {
			git.push(href);
		}
	}
	
	for(var i=0, l=file.length; i<l; i++) {
		var file = files[i];
		
		if(/((:?\d\.)+)/.exec(file)) {
			version = RegExp.$1;
			versions.push(version.substring(0, version.length-1));
		}
		
	}
	
	versions.sort();
	versions.reverse();

	versions = uniqueArray(versions);

	var colorsObj = {};
	for(var i=0, l=versions.length; i<l; i++) {
		var ver = versions[i];

		colorsObj[ver] = {};

		for(var j=0, len=files.length; j<len; j++) {
			var file = files[j];

			if(file.indexOf('git') == -1) {
				var href = '<a href="/color/'+file+'">' + file + '</a>';

				if(file.indexOf('svg') > -1) {
					if(!colorsObj[ver].svg) {
						colorsObj[ver].svg = [];
					}
					colorsObj[ver].svg.push(href);
				} else if(file.indexOf('plus') > -1) {
					if(!colorsObj[ver].plus) {
						colorsObj[ver].plus = [];
					}
					colorsObj[ver].plus.push(href);
				} else {
					if(!colorsObj[ver].js) {
						colorsObj[ver].js = [];
					}
					colorsObj[ver].js.push(href);
				}
			}
		}
	}
	
	for(var version in colorsObj) {
		var obj = colorsObj[version];

		headings.push('<h2>' + version + '</h2>');
		headings.push((obj.js.concat(obj.svg).concat(obj.plus)).join(''));
	}
	
	git.sort();

	return {
		git: git,
		versions: headings
	};
}

function getQunit() {
	var git = [],
		latest = [],
		path = basePath + '/qunit/',
		files = fs.readdirSync(path);

	//Sort directories on time last updated
	files.sort(function(a, b) {
		var aStat = fs.statSync(path + a),
			bStat = fs.statSync(path + b);

		return bStat.mtime.getTime() - aStat.mtime.getTime();
	});

	for(var i=0, len=files.length; i<len; i++) {
		var file = files[i],
			stat = fs.statSync(path + file),
			href = '<a href="/ui/' + file +'">' + file + '</a>';

		if(/git/.exec(file) && stat.isFile()) {
			git.push(href);
		} else {
			latest.push(href);
		}
	}

	git.sort();
	latest.sort();

	return {
		git: git,
		latest: latest.splice(0, 2)
	};
}

var jqueryColors = getjQueryColors(),
	qunit = getQunit(),
	template = fs.readFileSync(basePath + 'index.template.html', 'UTF-8');
	

template = template.replace('{{jquery_mobile_stable}}', getjQueryMobileLatest().join(''))
				   .replace('{{jquery_mobile_git_copy}}', getjQueryMobileGitVersion().join(''))
				   .replace('{{jquery_ui_git_copy}}', getjQueryUIGit().join(''))
				   .replace('{{jquery_color_git}}', jqueryColors.git.join(''))
				   .replace('{{qunit_git}}', qunit.git.join(''))
				   .replace('{{qunit_release}}', qunit.latest.join(''))
				   .replace('{{jquery_ui}}', getjQueryUIVersions().join(''))
				   .replace('{{jquery_color_versions}}', jqueryColors.versions.join(''))
				   .replace('{{jquery_mobile}}', getjQueryMobilePrevious().join(''))
				   .replace('{{all_jquery_versions}}', getjQueryVersions().join(''));

fs.writeFileSync(basePath + 'index.html', template, 'UTF-8');