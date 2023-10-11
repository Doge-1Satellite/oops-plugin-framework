/*
 * @Author: dgflash
 * @Date: 2022-08-15 10:06:47
 * @LastEditors: dgflash
 * @LastEditTime: 2022-09-02 13:44:12
 */
import { error, instantiate, Node, Prefab } from "cc";
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
        viewParams.params = { content: content, useI18n: useI18n };
        viewParams.callbacks = {};
        viewParams.valid = true;

        this.ui_nodes.set(viewParams.uuid, viewParams);
        this.load(viewParams);
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
        // let annCom = childNode.getComponent(announcementSys)!;
        childNode.active = true;
        if (toastCom != null)
            toastCom.toast(viewParams.params.content, viewParams.params.useI18n);
        // if(annCom != null)
        //     annCom.show(viewParams.params.content);
        return childNode;
    }
}