/*
 * @Author: dgflash
 * @Date: 2023-01-19 10:33:49
 * @LastEditors: dgflash
 * @LastEditTime: 2023-01-19 14:37:19
 */
import { Component } from "cc";
import { StringUtil } from "../../utils/StringUtil";
import { Timer } from "./Timer";

/** 时间管理 */
export class TimerManager extends Component {
    /** 倒计时数据 */
    private times: any = {};
    /** 当前游戏进入的时间毫秒值 */
    private initTime: number = (new Date()).getTime();
    /** 服务器时间与本地时间同步 */
    private serverTime: number = 0;

    update(dt: number) {
        // 后台管理倒计时完成事件
        for (let key in this.times) {
            let data = this.times[key];
            var timer = data.timer as Timer;
            if (timer.update(dt)) {
                if (data.object[data.field] > 0) {
                    data.object[data.field]--;

                    // 倒计时结束触发
                    if (data.object[data.field] == 0) {
                        this.onTimerComplete(data);
                    }
                    // 触发每秒回调事件  
                    else if (data.onSecond) {
                        data.onSecond.call(data.object);
                    }
                }
            }
        }
    }

    /** 触发倒计时完成事件 */
    private onTimerComplete(data: any) {
        if (data.onComplete) data.onComplete.call(data.object);
        if (data.event) this.node.dispatchEvent(data.event);

        delete this.times[data.id];
    }

    /**
     * 在指定对象上注册一个倒计时的回调管理器
     * @param object        注册定时器的对象
     * @param field         时间字段
     * @param onSecond      每秒事件
     * @param onComplete    倒计时完成事件
     * @returns 
     * @example
    export class Test extends Component {
        private timeId!: string;
        
        start() {
            // 在指定对象上注册一个倒计时的回调管理器
            this.timeId = oops.timer.register(this, "countDown", this.onSecond, this.onComplete);
        }
        
        private onSecond() {
            console.log("每秒触发一次");
        }

        private onComplete() {
            console.log("倒计时完成触发");
        }
    }
     */
    register(object: any, field: string, onSecond: Function, onComplete: Function): any {
        var timer = new Timer();
        timer.step = 1;

        let data: any = {};
        data.id = StringUtil.guid();
        data.timer = timer;
        data.object = object;                                   // 管理对象
        data.field = field;                                     // 时间字段
        data.onSecond = onSecond;                               // 每秒事件
        data.onComplete = onComplete;                           // 倒计时完成事件
        this.times[data.id] = data;
        return data.id;
    }

    /** 
     * 在指定对象上注销一个倒计时的回调管理器 
     * @param id         时间对象唯一表示
     * @example
    export class Test extends Component {
        private timeId!: string;

        start() {
            this.timeId = oops.timer.register(this, "countDown", this.onSecond, this.onComplete);
        }

        onDestroy() {
            // 在指定对象上注销一个倒计时的回调管理器
            oops.timer.unRegister(this.timeId);
        }
    }
     */
    unRegister(id: string) {
        if (this.times[id])
            delete this.times[id];
    }

    /**
     * 服务器时间与本地时间同步
     * @param val   服务器时间刻度
     * 
     */
    setServerTime(val?: number): number {
        if (val) {
            this.serverTime = val;
        }
        return this.serverTime;
    }
    getServerTime(): number {
        return this.serverTime + this.getTime();
    }

    /**
     * 格式化日期显示
     * @param format 格式化字符串（例：yyyy-MM-dd hh:mm:ss）
     * @param date   时间对象
     */
    format(format: string, date: Date): string {
        let o: any = {
            "M+": date.getMonth() + 1,                      // month 
            "d+": date.getDate(),                           // day 
            "h+": date.getHours(),                          // hour 
            "m+": date.getMinutes(),                        // minute 
            "s+": date.getSeconds(),                        // second 
            "q+": Math.floor((date.getMonth() + 3) / 3),    // quarter 
            "S": date.getMilliseconds()                     // millisecond 
        }
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (let k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }

    /** 获取游戏开始到现在逝去的时间 */
    getTime(): number {
        return this.getLocalTime() - this.initTime;
    }

    /** 获取本地时间刻度 */
    getLocalTime(): number {
        return Date.now();
    }

    /** 游戏最小化时记录时间数据 */
    save() {
        for (let key in this.times) {
            this.times[key].startTime = this.getTime();
        }
    }

    /** 游戏最大化时回复时间数据 */
    load() {
        for (let key in this.times) {
            let interval = Math.floor((this.getTime() - (this.times[key].startTime || this.getTime())) / 1000);
            let data = this.times[key];
            data.object[data.field] = data.object[data.field] - interval;
            if (data.object[data.field] < 0) {
                data.object[data.field] = 0;
                this.onTimerComplete(data);
            }
            this.times[key].startTime = null;
        }
    }
}