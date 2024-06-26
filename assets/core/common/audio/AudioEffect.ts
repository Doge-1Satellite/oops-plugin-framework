/*
 * @Author: dgflash
 * @Date: 2022-09-01 18:00:28
 * @LastEditors: dgflash
 * @LastEditTime: 2022-09-02 10:22:36
 */
import { AudioClip, AudioSource, error, _decorator } from 'cc';
import { oops } from '../../Oops';
const { ccclass, menu } = _decorator;

/**
 * 注：用playOneShot播放的音乐效果，在播放期间暂时没办法即时关闭音乐
 */

/** 游戏音效 */
@ccclass('AudioEffect')
export class AudioEffect extends AudioSource {
    private effects: Map<string, AudioClip> = new Map<string, AudioClip>();

    /**
     * 加载音效并播放
     * @param url           音效资源地址
     * @param callback      资源加载完成并开始播放回调
     */
    load(bundle:string,url: string, callback?: Function) {
        oops.res.load(bundle,url, AudioClip, (err: Error | null, data: AudioClip) => {
            if (err) {
                error(err);
            }

            this.effects.set(url, data);
            this.playOneShot(data, this.volume);
            callback && callback();
        });
    }

    /** 释放所有已使用过的音效资源 */
    release() {
        for (let key in this.effects) {
            oops.res.release(key);
        }
        this.effects.clear();
    }
}
