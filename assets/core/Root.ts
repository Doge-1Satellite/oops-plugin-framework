/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2023-02-14 18:07:56
 */
import { Component, Game, JsonAsset, Node, _decorator, director, game, log, sys, view, macro, dynamicAtlasManager } from "cc";
import { LanguageManager } from "../libs/gui/language/Language";
import { BuildTimeConstants } from "../module/config/BuildTimeConstants";
import { GameConfig } from "../module/config/GameConfig";
import { GameQueryConfig } from "../module/config/GameQueryConfig";
import { oops, version } from "./Oops";
import { AudioManager } from "./common/audio/AudioManager";
import { EventMessage } from "./common/event/EventMessage";
import { GameManager } from "./game/GameManager";
import { GUI } from "./gui/GUI";
import { LayerManager } from "./gui/layer/LayerManager";
import { TimerManager } from "./common/timer/TimerManager";
const { ccclass, property } = _decorator;

/** 框架显示层根节点 */
export class Root extends Component {
    /** 游戏层节点 */
    @property({
        type: Node,
        tooltip: "游戏层"
    })
    game: Node = null!;

    /** 界面层节点 */
    @property({
        type: Node,
        tooltip: "界面层"
    })
    gui: Node = null!;

    /** 持久根节点 */
    persistRootNode: Node = null!

    onLoad() {
        console.log(`Oops Framework v${version}`);
        this.enabled = false;
        // let heards: string;
        // if (sys.platform === sys.Platform.WECHAT_GAME) {
        //     console.log("验证login")
        //     wx.login({
        //         success: (res) => {
        //             let code = res.code;
        //             console.log(code);
        //             const request = new XMLHttpRequest();
        //             request.onreadystatechange = function () {
        //                 if (request.readyState === 4) {
        //                     console.log(request.status)

        //                     if (request.status >= 200 && request.status < 400) {
        //                         // 请求成功处理
        //                         console.log(request.responseText);
        //                         let json = JSON.parse(request.responseText)
        //                         heards = json.data.secWebSocketProtocol;
        //                         netChannel.gameCreate();
        //                         console.log("开始连接服务器");
        //                         netChannel.gameConnect({
        //                             url: `wss://dwmf.erapilot.xyz:8086`,
        //                             autoReconnect: 0,        // 手动重连接
        //                             headers: heards
        //                         });
        //                     } else {
        //                         // 请求失败处理
        //                         console.error('Network request failed', request.statusText);
        //                     }
        //                 }
        //             };
        //             request.open('POST', `https://dwmf.erapilot.xyz:8086/weChat/login`, true);
        //             request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //             request.send(`jsCode=${code}`);
        //         }
        //     });
        // } if (sys.platform === sys.Platform.BYTEDANCE_MINI_GAME) {
        //     console.log("当前平台为抖音小游戏平台");
        //     let mode = 1;
        //     tt.login({
        //         force: true,
        //         success(res) {
        //             console.log(`login 调用成功${res.code} ${res.anonymousCode}`)
        //             let code = res.code;
        //             //链接服务器
        //             const request = new XMLHttpRequest();
        //             request.onreadystatechange = function () {
        //                 if (request.readyState === 4) {
        //                     console.log(request.status)
        //                     if (request.status >= 200 && request.status < 400) {
        //                         // 请求成功处理
        //                         console.log(request.responseText);
        //                         let json = JSON.parse(request.responseText)
        //                         heards = json.data.secWebSocketProtocol;
        //                         netChannel.gameCreate();
        //                         console.log("开始连接服务器");
        //                         netChannel.gameConnect({
        //                             url: `wss://dwmf.erapilot.xyz:8086`,
        //                             autoReconnect: 0,        // 手动重连接
        //                             headers: heards
        //                         });
        //                     } else {
        //                         // 请求失败处理
        //                         console.error('Network request failed', request.statusText);
        //                     }
        //                 }
        //             };
        //             request.open('POST', `https://dwmf.erapilot.xyz:8086/weChat/login`, true);
        //             request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //             request.send(`jsCode=${code}&mode=${mode}`);

        //             //获取用户信息
        //             // tt.getUserInfo({
        //             //     // withCredentials: true,
        //             //     // withRealNameAuthenticationInfo: true,
        //             //     success(res) {
        //             //         console.log(`getUserInfo 调用成功`, res.userInfo);
        //             //     },
        //             //     fail(res) {
        //             //         console.log(`getUserInfo 调用失败`, res.errMsg);
        //             //     },
        //             // });
        //             //--end
        //         },
        //         fail(res) {
        //             console.log(`login 调用失败`)
        //         },
        //     })

        // }
        // else {
        //     console.log("其他平台");
        //     const request = new XMLHttpRequest();
        //     request.onreadystatechange = function () {
        //         if (request.readyState === 4) {
        //             console.log(request.status)

        //             if (request.status >= 200 && request.status < 400) {
        //                 // 请求成功处理
        //                 console.log(request.responseText);
        //                 let json = JSON.parse(request.responseText)
        //                 heards = json.data.secWebSocketProtocol;
        //                 netChannel.gameCreate();
        //                 console.log("开始连接服务器");
        //                 netChannel.gameConnect({
        //                     url: `wss://dwmf.erapilot.xyz:8086`,
        //                     autoReconnect: 0,        // 手动重连接
        //                     headers: heards
        //                 });
        //             } else {
        //                 // 请求失败处理
        //                 console.error('Network request failed', request.statusText);
        //             }
        //         }
        //     };
        //     request.open('POST', `https://dwmf.erapilot.xyz:8086/weChat/login`, true);
        //     request.setRequestHeader('Access-Control-Allow-Origin', '*');
        //     request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //     request.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0');
        //     request.send(`jsCode=456`);
        //     // console.log("非微信小程序登入")
        //     // netChannel.gameCreate();
        //     // console.log("开始连接服务器");
        //     // netChannel.gameConnect({
        //     //     url: `wss://dwmf.erapilot.xyz:8086`,
        //     //     autoReconnect: 0,        // 手动重连接
        //     //     headers: heards
        //     // })
        // }

        let config_name = "config";
        oops.res.load(config_name, JsonAsset, () => {
            var config = oops.res.get(config_name);
            oops.config.btc = new BuildTimeConstants();
            oops.config.query = new GameQueryConfig();
            oops.config.game = new GameConfig(config);
            oops.http.server = oops.config.game.httpServer;                                      // Http 服务器地址
            oops.http.timeout = oops.config.game.httpTimeout;                                    // Http 请求超时时间
            oops.storage.init(oops.config.game.localDataKey, oops.config.game.localDataIv);      // 初始化本地存储加密
            game.frameRate = oops.config.game.frameRate;                                         // 初始化每秒传输帧数


            this.enabled = true;
            this.init();
            this.run();
        });
    }

    update(dt: number) {
        oops.ecs.execute(dt);
    }

    /** 初始化游戏界面 */
    protected initGui() {

    }

    /** 初始化游戏业务模块 */
    protected initEcsSystem() {

    }

    /** 加载完引擎配置文件后执行 */
    protected run() {

    }

    protected init() {
        // console.log("开启动态合图");
        // macro.CLEANUP_IMAGE_CACHE = false;
        // dynamicAtlasManager.enabled = true;
        // 创建持久根节点
        this.persistRootNode = new Node("PersistRootNode");
        director.addPersistRootNode(this.persistRootNode);

        // 创建音频模块
        oops.audio = this.persistRootNode.addComponent(AudioManager);
        oops.audio.load();

        // 创建时间模块
        oops.timer = this.persistRootNode.addComponent(TimerManager)!;

        oops.language = new LanguageManager();
        oops.game = new GameManager(this.game);
        oops.gui = new LayerManager(this.gui);
        this.initGui();

        this.initEcsSystem();
        oops.ecs.init();

        // 游戏显示事件
        game.on(Game.EVENT_SHOW, () => {
            log("Game.EVENT_SHOW");
            oops.timer.load();     // 平台不需要在退出时精准计算时间，直接暂时游戏时间
            oops.audio.resumeAll();
            director.resume();
            game.resume();
            oops.message.dispatchEvent(EventMessage.GAME_ENTER);
        });

        // 游戏隐藏事件
        game.on(Game.EVENT_HIDE, () => {
            log("Game.EVENT_HIDE");
            oops.timer.save();     // 平台不需要在退出时精准计算时间，直接暂时游戏时间
            oops.audio.pauseAll();
            director.pause();
            game.pause();
            oops.message.dispatchEvent(EventMessage.GAME_EXIT);
        });

        // 游戏尺寸修改事件
        var c_gui = this.gui.addComponent(GUI)!;
        if (sys.isMobile == false) {
            view.setResizeCallback(() => {
                c_gui.resize();
                oops.message.dispatchEvent(EventMessage.GAME_RESIZE);
            });
        }
    }
}