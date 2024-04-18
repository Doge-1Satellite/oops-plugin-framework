/*
 * @Author: dgflash
 * @Date: 2022-08-15 10:06:47
 * @LastEditors: dgflash
 * @LastEditTime: 2022-09-02 13:44:12
 */
import { error, instantiate, Node, Prefab, UITransform, Vec3 } from "cc";
import { oops } from "../../Oops";
import { Notify } from "../prompt/Notify";
import { ViewParams } from "./Defines";
import { DelegateComponent } from "./DelegateComponent";
import { LayerUI } from "./LayerUI";
import { announcementSys } from "../../../../../../assets/script/pop/announcementSys";

const ToastPrefabPath: string = 'Windows/Common/Prefab/notify';

/*
 * 滚动消息提示层
 */
export class LayerNotify extends LayerUI {

    private notify_num: number = 0;
    /**
     * 显示toast
     * @param content 文本表示
     * @param useI18n 是否使用多语言
     * @param prefab 9.15_王敬宇 修改: prefab参数不是原生, prefab用于滚动消息提示, 不填写不影响原生功能
     */
    show(content?: string, useI18n?: boolean, prefab?: string): void {
        var viewParams = new ViewParams();
        if (prefab == null) {
            viewParams.uuid = this.getUuid(ToastPrefabPath);
            viewParams.prefabPath = ToastPrefabPath;
        }
        else {
            viewParams.uuid = this.getUuid(prefab);
            viewParams.prefabPath = prefab;
        }
        viewParams.params = { content: content, useI18n: useI18n, iseq: false };
        viewParams.callbacks = {};
        viewParams.valid = true;

        this.ui_nodes.set(viewParams.uuid, viewParams);
        this.load(viewParams);
    }

    eqShow(content?: string, useI18n?: boolean) {
        var viewParams = new ViewParams();
        viewParams.uuid = this.getUuid(ToastPrefabPath);
        viewParams.prefabPath = ToastPrefabPath;
        viewParams.params = { content: content, useI18n: useI18n, iseq: true };
        viewParams.callbacks = {};
        viewParams.valid = true;

        this.ui_nodes.set(viewParams.uuid, viewParams);
        this.load(viewParams);

    }

    eqDestroy() {

    }

    protected load(viewParams: ViewParams) {
        // 获取预制件资源

        oops.res.load("res", viewParams.prefabPath, (err: Error | null, res: Prefab) => {
            if (err) {
                error(err);
            }
            let childNode: Node = instantiate(res);
            viewParams.node = childNode;

            let comp: DelegateComponent = childNode.addComponent(DelegateComponent);
            comp.viewParams = viewParams;

            this.createNode(viewParams);
        });
    }

    protected createNode(viewParams: ViewParams) {
        let childNode: Node = super.createNode(viewParams);
        let toastCom = childNode.getComponent(Notify)!;
        if (viewParams.params.iseq) {
            childNode.active = false;
            childNode.setPosition(0, 130, 0)
            childNode.scale = new Vec3(1.5, 1.5, 1);
            this.notify_num++

            let length = this.notify_num
            if (toastCom != null)
                console.log(this.notify_num, 'notify_num');
            setTimeout(() => {
                childNode.getComponent(UITransform).priority = length;
                toastCom.toast(viewParams.params.content, viewParams.params.useI18n, viewParams.params.iseq, length % 3);
            }, 200 * this.notify_num);

            setTimeout(() => {
                if (length == this.notify_num) {
                    this.notify_num = 0;
                }
            }, 1000);
        } else {
            if (toastCom != null)
                toastCom.toast(viewParams.params.content, viewParams.params.useI18n, viewParams.params.iseq, 0);
        }





        // toastCom.toast(viewParams.params.content, viewParams.params.useI18n, viewParams.params.iseq);
        return childNode;
    }
}