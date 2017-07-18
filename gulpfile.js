
var gulp = require('gulp'),  							//gulp插件
	less = require('gulp-less'),					 	//less编译
	autoprefixer = require('gulp-autoprefixer'),	 	//添加css兼容后缀
	minifycss = require('gulp-minify-css'),			 	//css压缩
	jshint = require('gulp-jshint'),      			 	//js语法检查
	uglify = require('gulp-uglify'),    				//js压缩
	imagemin = require('gulp-imagemin'), 				//图片压缩
	pngquant = require('imagemin-pngquant'),			//压缩png图片
	rename = require('gulp-rename'),   					//修改名字
	concat = require('gulp-concat'), 					//合并
	notify = require('gulp-notify'), 					// 提示
	clean = require('gulp-clean'),  					//清空文件内容
	cache = require('gulp-cache'), 						// 避免未改动的图片再次压缩
	browserSync = require('browser-sync').create(),  	//文件改动 浏览器实时更新
	spriter = require('gulp-css-spriter'),	 			//生成雪碧图
	//addversions = require('gulp-rev-append'),			//路径添加版本码
	sourcemaps = require('gulp-sourcemaps'),			//生成sourceMappingURL   作用不详
	plumber = require('gulp-plumber'),					//当less编译或js报错是不终止监听修正后可正常编译
	htmlmin = require('gulp-htmlmin'),
	rev = require('gulp-rev'),
	revCollector = require('gulp-rev-collector'),
	replace = require('gulp-replace');


	var config = {
		devConfig: 'src/',
		distConfig: 'dist/',
		lessPath: 'src/less',
		jsPath: ['src/libs/*.js', 'src/js/*.js'],
		cssPath: ['src/css/*/*.css', 'src/css/*.css'],
		imgPath: 'src/images',
		htmlTpPath: 'src/template',
		port: 8080,
		liveUpdateMap: [
//			'./dist/*',
//			'./static/**/**/*',
			'src/template/*.html',
			'src/css/*.css',
			'src/*',
			'index.html'
			


		]
	}
// less => css
gulp.task('compile_less', function () {
	return gulp.src(config.lessPath + '/*.less')
		.pipe(sourcemaps.init())
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		.pipe(less())
		.pipe(sourcemaps.write())
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(config.devConfig + 'css/'))
		.pipe(minifycss())
		.pipe(gulp.dest(config.distConfig + 'css/'))
		.pipe(browserSync.stream())
		.pipe(notify({message: 'less task complete'}));
});


// 按照src目录结构压缩到dist
gulp.task('css_min', ['compile_less'], function (){
	return gulp.src(config.cssPath, {base: 'src'})
		.pipe(minifycss())
		.pipe(gulp.dest(config.distConfig) )
		.pipe(rev())
		.pipe(rev.manifest())
		.pipe(gulp.dest(config.distConfig) )
		.pipe(browserSync.stream())
		.pipe(notify({message: 'css task complete'}));

});

//gulp.task('test', ['css_min'], function (){
//	return gulp.src(['dist/*.json', 'src/template/*.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
//      .pipe(revCollector())                                   //- 执行文件内css名的替换
//
//        .pipe(gulp.dest('dist/template/'));                     //- 替换后的文件输出的目录
//});



// Scripts
gulp.task('js_min', function () {
	return gulp.src( config.jsPath, {base: 'src'})
		.pipe(jshint())
		
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		
		.pipe(jshint.reporter('default'))
		.pipe(concat('main.js'))//js包合并
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.distConfig + '/js' ))
		.pipe(uglify())
		.pipe(rev())
		.pipe(rev.manifest())
		.pipe(gulp.dest(config.distConfig + '/js'))
		.pipe(notify({message: 'js task complete'}));
});
// Images
gulp.task('img_min', function () {
	return gulp.src(config.imgPath + '/*')
		.pipe(cache(imagemin({
			optimizationLevel: 3, 	//类型：Number  默认：3  取值范围：0-7（优化等级）
			progressive: true,    	//类型：Boolean 默认：false 无损压缩jpg图片
			interlaced: true, 		//类型：Boolean 默认：false 隔行扫描gif进行渲染
			use: [pngquant()]
		})))
		.pipe(gulp.dest(config.distConfig + 'images/'))
		.pipe(notify({message: 'img task complete'}));
});

gulp.task('Html_min', ['clean', 'img_min', 'css_min'], function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src( [config.distConfig + 'css/*.json', config.htmlTpPath + '/*.html'])
        .pipe(revCollector())
        .pipe(htmlmin(options))
        .pipe(gulp.dest(config.distConfig + 'template/'));
});


// Css-sprite
gulp.task('sprite', function () {
	return gulp.src(devConfig + 'css/test.css')//需要自动合并雪碧图的样式文件
		.pipe(spriter({
			'spriteSheet': proConfig + 'img/sprite/sprites.png',//生成的spriter的位置
			'pathToSpriteSheetFromCSS': '../../../dist/img/sprite/sprites.png'//生成样式文件图片引用地址的路径
		}))
		.pipe(minifycss())
		.pipe(gulp.dest(proConfig + '/css/global/'))
		.pipe(notify({message: 'sprite task complete'}));
});

// Clean
gulp.task('clean', function () {
	return gulp.src([config.distConfig + '/*'], {
		read: false
	}).pipe(clean());
});

//liveupdate
gulp.task('liveUpdate', function() {
	browserSync.init({
		server: './',
		port: config.port,
		notify: false,//关闭浏览器debug框
		ghostMode: {//点击，滚动和表单在任何设备上输入将被镜像到所有设备里
			clicks: true,
			forms: true,
			scroll: false
		},
		online: true,//不会尝试确定网络状况，假设你在线
		open: false
	});
	//gulp.watch(config.lessPath + '/*.less', ['compile_less']).on('change', browserSync.reload);
	gulp.watch(config.lessPath + '/*.less', ['compile_less']).on('change', browserSync.reload);
	// gulp.watch(config.jsPath + '/*.js', ['js_min']).on('change', browserSync.reload);
	gulp.watch(config.jsPath + '/*.js').on('change', browserSync.reload);
	
	gulp.watch(config.liveUpdateMap, function (file) {
		console.log('===============文件改动列表===============');
		console.log(file.path);
		console.log('===============文件改动列表===============');
		browserSync.reload();
		
	});
});



// 打包
gulp.task('build', function () {
	gulp.start('clean', ['css_min', 'img_min', 'Html_min', 'js_min']);
});












//将页面中  这种形式替换合并的路径
//
//	<!-- build: css/index.css -->  
//  	<link rel="stylesheet" href="css/index.css?v1234554" type="text/css" />
//  <!-- endbuild -->  

/*
gulp.task('replacePath', function(){
    var regular = /<\!--\s*build:(.+)\s*-->[\s\S\r\n]*?<\!--\s*endbuild\s*-->/gm ,
        scriptTemp = '<script src="$1" type="text/javascript"></script>',
        cssTemp = '<link rel="stylesheet" type="text/css" href="$1" />';
    gulp.src("./index.html")
        .pipe( replace(regular, function($0, $1){ 
            var temp = /.+\.js/.test($1) ? scriptTemp: cssTemp;  
            console.log($1,$0)
            return temp.replace('$1', config.distConfig+$1.trim());            
        }))
        .pipe(gulp.dest("./dist"))    
})
*/



















/*var gulp = require('gulp'),
	less = require('gulp-less'),
	uglify = require('gulp-uglify'),
 	livereload = require('gulp-livereload'),
 	autoprefixer = require('gulp-autoprefixer');

//编译less
gulp.task('compile_less', function () {
	gulp.src('src/less/*.less')
		.pipe(less())
		.pipe(gulp.dest('src/css'))
		.pipe(livereload());
});

//压缩css
gulp.task('minicss', ['compile_less'], function (){
	gulp.src(['src/css/*.css'])
		.pipe(minifyCss())
		.pipe(gulp.dest('dest/css'));
});
//压缩 js
gulp.task('jsmin', function(){
	gulp.src('src/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

//样式添加前缀
gulp.task('autoFx', function () {
	gulp.src('src/css/*.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'android >= 4.0','>1%', 'safari 5', 'ie 8', 'opera 12'],
			cascade: true,
			remove: true
		}))
		.pipe(gulp.dest('dist/css'));
});

//监听less，编译less
gulp.task('watch', function () {
	livereload.listen();
	gulp.watch('src/less/*.less',['compile_less'])
});
gulp.task('build', ['minicss']);

*/















/*


    <!-- build: css/index.css -->  
        <link rel="stylesheet" href="css/index.css" type="text/css" />
        <!-- endbuild -->  




        <!-- build: js/public.js -->    
        <script type="text/javascript" src="com/js/jq.min.js" ></script>
        <script type="text/javascript" src="com/js/jquery.easing.min.js" ></script>
        <script type="text/javascript" src="com/js/public.js" ></script>
        <!-- endbuild -->

        <!-- build: js/index.js -->    
        <script type="text/javascript" src="com/js/scroll.js" ></script>
        <script type="text/javascript" src="js/index.js" ></script>
        <!-- endbuild -->



var gulp = require('gulp')
var sass = require('gulp-sass')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')

var htmlmin = require("gulp-htmlmin")
var replace = require("gulp-replace")

var imagemin = require("gulp-imagemin")
var cache = require("gulp-cache")
var pngquant = require("imagemin-pngquant")

var outputFoot = './build'

gulp.task('html', function(){

    var options = {
        removeComments: true, //清除注释
        collapseWihtespace: true, //压缩html
        collapseBooleanAttributes: true, //省略布尔属性的值
        removeEmptyAttributes: true, //删除所有空值的属性
//        removeScriptTypeAttributes: true, //删除 script的type="text/javascript"属性
        removeStyleLinkTypeAttributes: true, //删除style和link的 type="text/css"
        minifyJS: true, //压缩页面js
        minifyCSS: true //压缩页面css
    }

    var regular = /<\!--\s*build:(.+)\s*-->[\s\S\r\n]*?<\!--\s*endbuild\s*-->/gm ,
        scriptTemp = '<script src="$1" type="text/javascript"></script>',
        cssTemp = '<link rel="stylesheet" type="text/css" href="$1" />';


    gulp.src("./index.html")
        .pipe( replace(regular, function($0, $1){        

            var temp = /.+\.js/.test($1) ? scriptTemp: cssTemp;        

            return temp.replace('$1', $1);            
        }))
        .pipe(gulp.dest("./dist"))    
})*/