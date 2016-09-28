var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var project = 'home';

gulp.task('server', function () {
    plugins.connect.server({
        host:'m.wssf.com',
        port: 8080,
        root:['build/','./'],
        // root:['apps/','./'],
        middleware: function (connect,opt) {
            return [];
        }
    });
});



gulp.task('test', function () {
    plugins.connect.server({
        host:'t.m.wssf.com',
        port: 9898,
        //root:['yyg/app/','yyg/','./','./../../','../'],
        //
        root:['dest/'],
        middleware: function (connect,opt) {
            return [];
        }
    });
});

//清理
gulp.task('clean-dest',function(){
    return gulp.src([
        'dest/*',
        '!dest/sftp-config.json'
        ],{read:false})
    .pipe(plugins.clean());
});
gulp.task('clean-build',function(){
    return gulp.src([
        'build/*',
        '!dest/sftp-config.json'
        ],{read:false})
    .pipe(plugins.clean());
});

//压缩JS
gulp.task('build-js',function(){//开发版本
    return gulp.src([
            'apps/'+project+'/scripts/app.js',
            'apps/'+project+'/scripts/controller/*.js',
            'apps/'+project+'/scripts/service/*.js',
            'apps/'+project+'/scripts/directive/*.js'
        ])
        .pipe(plugins.concat('all.min.js'))
        // .pipe(plugins.rev())
        .pipe(gulp.dest('build/'+project+'/scripts/'))
        // .pipe(plugins.rev.manifest())
        // .pipe(gulp.dest('build/'+project+'/version/scripts'));
})
gulp.task('dest-js', function(){//输出版本
     return gulp.src([
            'apps/'+project+'/scripts/app.js',
            'apps/'+project+'/scripts/controller/*.js',
            'apps/'+project+'/scripts/service/*.js',
            'apps/'+project+'/scripts/directive/*.js'
            ])
        .pipe(plugins.concat('all.js'))
        .pipe(gulp.dest('dest/'+project+'/scripts/'))
        .pipe(plugins.uglify({
               mangle: false
           }))
        .pipe(plugins.rename('all.min.js'))
        .pipe(plugins.rev())
        .pipe(gulp.dest('dest/'+project+'/scripts/'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dest/'+project+'/version/scripts'));
});



//framework
gulp.task('build-framework',function(){
    return gulp.src(['node_modules/angular/angular.min.js',
              'node_modules/angular-ui-router/release/angular-ui-router.min.js',
              'node_modules/angular-cookies/angular-cookies.min.js',
              'apps/public/scripts/lib/layer/layer.js',
              'apps/public/scripts/lib/swiper/swiper-3.3.1.min.js'
        ])
        .pipe(plugins.concat('framework.min.js'))
        .pipe(gulp.dest('build/'+project+'/framework'))
})
gulp.task('dest-framework',function(){
    return gulp.src(['node_modules/angular/angular.min.js',
              'node_modules/angular-ui-router/release/angular-ui-router.min.js',
              'node_modules/angular-cookies/angular-cookies.min.js',
              'apps/public/scripts/lib/layer/layer.js',
              'apps/public/scripts/lib/swiper/swiper-3.3.1.min.js'
        ])
        .pipe(plugins.concat('framework.js'))
        .pipe(gulp.dest('dest/'+project+'/framework'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename('framework.min.js'))
        .pipe(plugins.rev())
        .pipe(gulp.dest('dest/'+project+'/framework/'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dest/'+project+'/version/framework'));
});
//压缩css
gulp.task('build-css',function(){
    return gulp.src([
        'apps/public/scripts/lib/swiper/swiper-3.3.1.min.css',
        'apps/public/css/layout.css',
        'apps/public/scripts/lib/layer/layer.css',
        'apps/'+project+'/css/*.css'
    ])
    .pipe(plugins.concat('all.min.css'))
    .pipe(gulp.dest('build/'+project+'/css/'))
})
gulp.task('dest-css',function(){
    return gulp.src([
    'apps/public/scripts/lib/swiper/swiper-3.3.1.min.css',
    'apps/public/css/layout.css',
    'apps/public/scripts/lib/layer/layer.css',
    'apps/'+project+'/css/*.css'])
    .pipe(plugins.concat('all.min.css'))
    .pipe(plugins.minifyCss())
    .pipe(plugins.rev())
    .pipe(gulp.dest('dest/'+project+'/css/'))
    .pipe(plugins.rev.manifest())
    .pipe(gulp.dest('dest/'+project+'/version/css/'));
    //.pipe(gulp.dest('dest/css'));
});
gulp.task('build-md5',function(){
    return gulp.src([
            'apps/public/scripts/lib/md5/md5.js'
        ])
    .pipe(gulp.dest('build/'+project+'/framework/'));
})
gulp.task('dest-md5',function(){
    return gulp.src([
            'apps/public/scripts/lib/md5/md5.js'
        ])
    .pipe(gulp.dest('dest/'+project+'/framework/'));
})
//压缩HTML
gulp.task('build-html',function(){
    return gulp.src(['apps/'+project+'/views/**'])
        // .pipe(plugins.minifyHtml())
        .pipe(gulp.dest('build/'+project+'/views'));
});
gulp.task('dest-html',function(){
    return gulp.src(['apps/'+project+'/views/**'])
        .pipe(plugins.minifyHtml())
        .pipe(gulp.dest('dest/'+project+'/views'));
});
//压缩index.html
//
gulp.task('build-index',function(){
    var assets = plugins.useref.assets();
    return gulp.src(['apps/'+project+'/index.html'])
    .pipe(assets)
    .pipe(assets.restore())
    .pipe(plugins.useref())
    .pipe(gulp.dest('build/'+project+'/'));
})

gulp.task('dest-index',function(){
    var assets = plugins.useref.assets();

    return gulp.src(['apps/'+project+'/index.html'])
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(plugins.useref())
        // .pipe(plugins.minifyHtml())
        .pipe(gulp.dest('dest/'+project+'/'));
});

//版本号
gulp.task('dev',['dest-index','dest-css','dest-js','dest-html','dest-framework'],function(){
    return gulp.src(['dest/'+project+'/version/**/*.json','dest/'+project+'/index.html'])
        .pipe(plugins.revCollector({
                replaceReved:true
            })
        )
        .pipe(gulp.dest('dest/'+project+'/'));
});
gulp.task('build-dev',['build-index','build-css','build-js','build-html','build-framework'],function(){
    return gulp.src(['build/'+project+'/version/**/*.json','build/'+project+'/index.html'])
        .pipe(plugins.revCollector({
                replaceReved:true
            })
        )
        .pipe(gulp.dest('build/'+project+'/'));
});


gulp.task('build-images',function(){
    return gulp.src(['apps/'+project+'/images/*','apps/'+project+'/images/**/*','apps/public/images/*'])
    .pipe(gulp.dest('build/'+project+'/images/'));
})
gulp.task('dest-images',function(){
    return gulp.src(['apps/'+project+'/images/*','apps/'+project+'/images/**/*','apps/public/images/*'])
    .pipe(gulp.dest('dest/'+project+'/images/'));
});




gulp.task('build-act-js',function(){
     return gulp.src([
            'apps/activities/'+project+'/scripts/*.js',
            'apps/public/scripts/lib/activity/api.js'
        ])
        .pipe(plugins.concat('all.min.js'))
        .pipe(gulp.dest('build/activities/'+project+'/scripts/'))
});
gulp.task('act-js',function(){
    return gulp.src([
            'apps/activities/'+project+'/scripts/*.js',
            'apps/public/scripts/lib/activity/api.js'
        ])
        .pipe(plugins.concat('all.js'))
        .pipe(gulp.dest('dest/activities/'+project+'/scripts/'))
        .pipe(plugins.uglify({
               mangle: false
           }))
        .pipe(plugins.rename('all.min.js'))
        .pipe(plugins.rev())
        .pipe(gulp.dest('dest/activities/'+project+'/scripts/'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dest/activities/'+project+'/version/scripts'));
});

gulp.task('act-framework',function(){
    return gulp.src(['node_modules/angular/angular.min.js',
              // 'node_modules/angular-ui-router/release/angular-ui-router.min.js',
              'node_modules/angular-cookies/angular-cookies.min.js',
              'apps/public/scripts/lib/layer/layer.js',
              // 'apps/public/scripts/lib/swiper/swiper-3.3.1.min.js'
        ])
        .pipe(plugins.concat('framework.js'))
        .pipe(gulp.dest('dest/activities/'+project+'/framework'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename('framework.min.js'))
        .pipe(plugins.rev())
        .pipe(gulp.dest('dest/activities/'+project+'/framework/'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dest/activities/'+project+'/version/framework'));
});
gulp.task('build-act-framework',function(){
    return gulp.src(['node_modules/angular/angular.min.js',
              // 'node_modules/angular-ui-router/release/angular-ui-router.min.js',
              'node_modules/angular-cookies/angular-cookies.min.js',
              'apps/public/scripts/lib/layer/layer.js',
              // 'apps/public/scripts/lib/swiper/swiper-3.3.1.min.js'
        ])
        .pipe(plugins.concat('framework.min.js'))
        .pipe(gulp.dest('build/activities/'+project+'/framework'))
});

gulp.task('act-css',function(){
    return gulp.src([
    // 'apps/public/scripts/lib/swiper/swiper-3.3.1.min.css',
    'apps/public/css/layout.css',
    'apps/public/scripts/lib/layer/layer.css',
    'apps/activities/'+project+'/css/*.css'])
    .pipe(plugins.concat('all.min.css'))
    .pipe(plugins.minifyCss())
    .pipe(plugins.rev())
    .pipe(gulp.dest('dest/activities/'+project+'/css/'))
    .pipe(plugins.rev.manifest())
    .pipe(gulp.dest('dest/activities/'+project+'/version/css/'));
    //.pipe(gulp.dest('dest/css'));
});
gulp.task('build-act-css',function(){
    return gulp.src([
    // 'apps/public/scripts/lib/swiper/swiper-3.3.1.min.css',
    'apps/public/css/layout.css',
    'apps/public/scripts/lib/layer/layer.css',
    'apps/activities/'+project+'/css/*.css'
    ])
    .pipe(plugins.concat('all.min.css'))
    .pipe(gulp.dest('build/activities/'+project+'/css/'))
    //.pipe(gulp.dest('dest/css'));
});
gulp.task('act-md5',function(){
    return gulp.src([
            'apps/public/scripts/lib/md5/md5.js',
            'apps/public/scripts/lib/appcall/appcall.js'
        ])
    .pipe(gulp.dest('dest/activities/'+project+'/framework/'));
});
gulp.task('build-act-md5',function(){
    return gulp.src([
            'apps/public/scripts/lib/md5/md5.js',
            'apps/public/scripts/lib/appcall/appcall.js'
        ])
    .pipe(gulp.dest('build/activities/'+project+'/framework/'));
})

gulp.task('act-html',function(){
    return gulp.src(['apps/activities/'+project+'/views/**'])
        .pipe(plugins.minifyHtml())
        .pipe(gulp.dest('dest/activities/'+project+'/views'));
});
gulp.task('build-act-html',function(){
    return gulp.src(['apps/activities/'+project+'/views/**'])
        .pipe(plugins.minifyHtml())
        .pipe(gulp.dest('build/activities/'+project+'/views'));
});
//压缩index.html
gulp.task('act-index',function(){
    var assets = plugins.useref.assets();

    return gulp.src(['apps/activities/'+project+'/*.html'])
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(plugins.useref())
        // .pipe(plugins.minifyHtml())
        .pipe(gulp.dest('dest/activities/'+project+'/'));
});
gulp.task('build-act-index',function(){
    var assets = plugins.useref.assets();

    return gulp.src(['apps/activities/'+project+'/*.html'])
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(plugins.useref())
        .pipe(gulp.dest('build/activities/'+project+'/'));
});
//版本号
gulp.task('act-dev',['act-index','act-css','act-js','act-html','act-framework'],function(){
    return gulp.src(['dest/activities/'+project+'/version/**/*.json','dest/activities/'+project+'/*.html'])
        .pipe(plugins.revCollector({
                replaceReved:true
            })
        )
        .pipe(gulp.dest('dest/activities/'+project+'/'));
});


gulp.task('act-images',function(){
    return gulp.src(['apps/activities/'+project+'/images/*','apps/activities/'+project+'/images/**/*'])
    .pipe(gulp.dest('dest/activities/'+project+'/images/'));
});
gulp.task('build-act-images',function(){
    return gulp.src(['apps/activities/'+project+'/images/*','apps/activities/'+project+'/images/**/*'])
    .pipe(gulp.dest('build/activities/'+project+'/images/'));
});

gulp.task('dest',['dest-js','dest-md5','dest-html','dest-css','dest-images','dest-framework','dest-index','dev']);
gulp.task('build',['build-js','build-md5','build-html','build-css','build-images','build-framework','build-index']);

gulp.task('dest-hd',['act-js','act-md5','act-html','act-css','act-images','act-framework','act-index','act-dev']);
gulp.task('build-hd',['build-act-md5','build-act-js','build-act-html','build-act-css','build-act-images','build-act-framework','build-act-index']);


gulp.task('watchCode',function(){
    gulp.watch('apps/'+project+'/scripts/**',['build-js']);
    gulp.watch('apps/'+project+'/css/*.css',['build-css']);
    gulp.watch('apps/'+project+'/views/**',['build-html']);
    gulp.watch('apps/'+project+'/index.html',['build-index']);
});


gulp.task('watchHd',function(){
    gulp.watch('apps/activities/'+project+'/scripts/**',['build-act-js']);
    gulp.watch('apps/activities/'+project+'/css/*.css',['build-act-css']);
    gulp.watch('apps/activities/'+project+'/views/**',['build-act-html']);
    gulp.watch('apps/activities/'+project+'/index.html',['build-act-index']);
});