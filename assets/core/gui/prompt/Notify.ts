/*
 * @Author: dgflash
 * @Date: 2022-04-14 17:08:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-09-02 14:07:13
 */
import { Animation, Component, Node, RichText, tween, UIOpacity, Vec3, _decorator } from "cc";
import { Key } from "readline";
import { LanguageLabel } from "../../../libs/gui/language/LanguageLabel";

const { ccclass, property } = _decorator;

/** 滚动消息提示组件  */
@ccclass('Notify')
export class Notify extends Component {
    @property(RichText)
    private lab_content: RichText | null = null;

    @property(Animation)
    private animation: Animation | null = null;

    onLoad() {
        // if (this.animation)
        //     this.animation.on(Animation.EventType.FINISHED, this.onFinished, this);
    }

    private onFinished() {
        // this.node.destroy();
    }

    /**
     * 显示提示
     * @param msg       文本
     * @param useI18n   设置为 true 时，使用多语言功能 msg 参数为多语言 key
     */
    toast(msg: string, useI18n: boolean, iseq: boolean, length: number) {
        let label = this.lab_content?.getComponent(LanguageLabel)!;
        if (useI18n) {
            label.dataID = msg;
        }
        else {
            if (label)
                label.dataID = "";
            this.lab_content!.string = msg;
        }

        if (iseq) {
            switch (length) {
                case 0:
                    length = 1;
                    break;
                case 1:
                    length = 3;
                    break;
                default:
                    break;
            }
            tween(this.node)
                .to(0.5, { scale: new Vec3(1, 1, 1) }, {
                    onStart(target: Node) {
                        target.active = true;
                    }
                })
                .by(0.5, { position: new Vec3(0, length * 40, 0) }, {
                })
                .to(1, {})
                .by(0.1, {}, {
                    onUpdate(target: Node, ratio) {
                        target.getComponent(UIOpacity).opacity = (1 - ratio) * 255;
                    }
                })
                .call(() => {
                    if (iseq) {
                        this.node.destroy();
                    }
                })
                .start()
                
        } else {
            tween(this.node)
                .by(1, { position: new Vec3(0, 100, 0) }, {
                    onUpdate(target: Node, ratio) {
                        target.getComponent(UIOpacity).opacity = (1 - ratio) * 255;
                    }
                })
                .call(() => {
                    if (iseq) {
                        this.node.destroy();
                    }
                })
                .start()
        }


        // if (iseq) {
        //     this.node.setPosition(0, 120, 0);
        //     this.animation.play('notify2')
        // }else{
        //     this.node.setPosition(0,0,0);
        //     this.animation.play('notify')
        // }
        // console.log('iseq', iseq, 'this node pos', this.node.getPosition);


    }
}