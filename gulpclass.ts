import { Gulpclass, SequenceTask, Task } from "gulpclass/Decorators";

let gulp = require("gulp");
let del = require("del");
let path = require("path");
let ts = require("gulp-typescript");
let sourcemaps = require("gulp-sourcemaps");
let spawn = require("child_process").spawn;

@Gulpclass()
export class Gulpfile {

    @Task("clean")
    clean(cb: Function) {
        return del(["./lib/**/*.js", "./gulpclass.js", "./**/*.map"], cb);
    }

    @Task("build")
    build() {
        let tsProject:any = ts.createProject("tsconfig.json");

        return tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(""));
    }

    @Task("test")
    test() {
        return spawn("node", ["."], { stdio: "inherit" });
    }

    @SequenceTask()
    default() {
        return ["clean", "build", "test"];
    }
}
